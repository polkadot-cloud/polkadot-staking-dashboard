// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import {
  greaterThanZero,
  isNotZero,
  localStorageOrDefault,
  setStateWithRef,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useRef, useState } from 'react';
import { useBalances } from 'contexts/Balances';
import type { ExternalAccount } from '@polkadot-cloud/react/types';
import type { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import type {
  EraStakers,
  Exposure,
  StakingContextInterface,
  StakingMetrics,
  StakingTargets,
} from 'contexts/Staking/types';
import type { AnyApi, AnyJson, MaybeAddress } from 'types';
import Worker from 'workers/stakers?worker';
import type { ResponseInitialiseExposures } from 'workers/types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useApi } from '../Api';
import { useBonded } from '../Bonded';
import { useNetworkMetrics } from '../NetworkMetrics';
import {
  defaultEraStakers,
  defaultStakingContext,
  defaultStakingMetrics,
  defaultTargets,
} from './defaults';
import {
  setLocalEraExposures,
  getLocalEraExposures,
  formatRawExposures,
} from './Utils';

const worker = new Worker();

export const StakingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accounts: connectAccounts } = useImportedAccounts();
  const { activeAccount, getActiveAccount } = useActiveAccounts();
  const { getStashLedger } = useBalances();
  const { activeEra } = useNetworkMetrics();
  const { networkData, network } = useNetwork();
  const { isReady, api, apiStatus, consts } = useApi();
  const { bondedAccounts, getBondedAccount, getAccountNominations } =
    useBonded();
  const { maxNominatorRewardedPerValidator } = consts;

  // Store staking metrics in state.
  const [stakingMetrics, setStakingMetrics] = useState<StakingMetrics>(
    defaultStakingMetrics
  );

  // Store unsub object fro staking metrics.
  const unsub = useRef<VoidFn | null>(null);

  // Store eras stakers in state.
  const [eraStakers, setEraStakers] = useState<EraStakers>(defaultEraStakers);
  const eraStakersRef = useRef(eraStakers);

  // Flags whether `eraStakers` is resyncing.
  const [erasStakersSyncing, setErasStakersSyncing] = useState(false);
  const erasStakersSyncingRef = useRef(erasStakersSyncing);

  // Store target validators for the active account.
  const [targets, setTargetsState] = useState<StakingTargets>(
    localStorageOrDefault<StakingTargets>(
      `${activeAccount ?? ''}_targets`,
      defaultTargets,
      true
    ) as StakingTargets
  );

  // Handle metrics unsubscribe.
  const unsubscribeMetrics = () => {
    if (unsub.current !== null) {
      unsub.current();
      unsub.current = null;
    }
  };

  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data }: { data: ResponseInitialiseExposures } = message;
      const { task, networkName, era } = data;

      // ensure task matches, & era is still the same.
      if (
        task !== 'processExposures' ||
        networkName !== network ||
        era !== activeEra.index.toString()
      )
        return;

      const {
        stakers,
        totalActiveNominators,
        activeValidators,
        activeAccountOwnStake,
        who,
      } = data;

      // finish sync
      setStateWithRef(false, setErasStakersSyncing, erasStakersSyncingRef);

      // check if account hasn't changed since worker started
      if (getActiveAccount() === who) {
        setStateWithRef(
          {
            ...eraStakersRef.current,
            stakers,
            totalActiveNominators,
            activeValidators,
            activeAccountOwnStake,
          },
          setEraStakers,
          eraStakersRef
        );
      }
    }
  };

  // Multi subscription to staking metrics.
  const subscribeToStakingkMetrics = async () => {
    if (api !== null && isReady && isNotZero(activeEra.index)) {
      const previousEra = activeEra.index.minus(1);

      const u = await api.queryMulti<AnyApi>(
        [
          api.query.staking.counterForNominators,
          api.query.staking.counterForValidators,
          api.query.staking.maxValidatorsCount,
          api.query.staking.validatorCount,
          [api.query.staking.erasValidatorReward, previousEra.toString()],
          [api.query.staking.erasTotalStake, previousEra.toString()],
          api.query.staking.minNominatorBond,
          [api.query.staking.payee, activeAccount],
          [api.query.staking.erasTotalStake, activeEra.index.toString()],
        ],
        (q) => {
          setStakingMetrics({
            totalNominators: new BigNumber(q[0].toString()),
            totalValidators: new BigNumber(q[1].toString()),
            maxValidatorsCount: new BigNumber(q[2].toString()),
            validatorCount: new BigNumber(q[3].toString()),
            lastReward: new BigNumber(q[4].toString()),
            lastTotalStake: new BigNumber(q[5].toString()),
            minNominatorBond: new BigNumber(q[6].toString()),
            payee: processPayee(q[7]),
            totalStaked: new BigNumber(q[8].toString()),
          });
        }
      );

      unsub.current = u;
    }
  };

  // Process raw payee object from API. payee with `Account` type is returned as an key value pair,
  // with all others strings. This function handles both cases and formats into a unified structure.
  const processPayee = (rawPayee: AnyApi) => {
    const payeeHuman = rawPayee.toHuman();

    let payeeFinal: PayeeConfig;
    if (typeof payeeHuman === 'string') {
      const destination = payeeHuman as PayeeOptions;
      payeeFinal = {
        destination,
        account: null,
      };
    } else {
      const payeeEntry = Object.entries(payeeHuman);
      const destination = `${payeeEntry[0][0]}` as PayeeOptions;
      const account = `${payeeEntry[0][1]}` as MaybeAddress;
      payeeFinal = {
        destination,
        account,
      };
    }
    return payeeFinal;
  };

  // Fetches erasStakers exposures for an era, and saves to `localStorage`.
  const fetchEraStakers = async (era: string) => {
    if (!isReady || activeEra.index.isZero() || !api) return [];

    let exposures: Exposure[] = [];
    const localExposures = getLocalEraExposures(
      network,
      era,
      activeEra.index.toString()
    );

    if (localExposures) {
      exposures = localExposures;
    } else {
      exposures = formatRawExposures(
        await api.query.staking.erasStakers.entries(era)
      );
    }

    // For resource limitation concerns, only store the current era in local storage.
    if (era === activeEra.index.toString())
      setLocalEraExposures(network, era, exposures);

    return exposures;
  };

  // Fetches the active nominator set and metadata around it.
  const fetchActiveEraStakers = async () => {
    if (!isReady || activeEra.index.isZero() || !api) return;

    // flag eraStakers is recyncing
    setStateWithRef(true, setErasStakersSyncing, erasStakersSyncingRef);

    const exposures = await fetchEraStakers(activeEra.index.toString());

    // worker to calculate stats
    worker.postMessage({
      era: activeEra.index.toString(),
      networkName: network,
      task: 'processExposures',
      activeAccount,
      units: networkData.units,
      exposures,
      maxNominatorRewardedPerValidator:
        maxNominatorRewardedPerValidator.toNumber(),
    });
  };

  // Sets an account's stored target validators.
  const setTargets = (value: StakingTargets) => {
    localStorage.setItem(`${activeAccount}_targets`, JSON.stringify(value));
    setTargetsState(value);
  };

  // Gets the nomination statuses of passed in nominations.
  const getNominationsStatusFromTargets = (
    who: MaybeAddress,
    fromTargets: AnyJson[]
  ) => {
    const statuses: Record<string, string> = {};

    if (!fromTargets.length) {
      return statuses;
    }

    for (const target of fromTargets) {
      const staker = eraStakersRef.current.stakers.find(
        ({ address }) => address === target
      );

      if (staker === undefined) {
        statuses[target] = 'waiting';
        continue;
      }

      if (!(staker.others ?? []).find((o: any) => o.who === who)) {
        statuses[target] = 'inactive';
        continue;
      }
      statuses[target] = 'active';
    }
    return statuses;
  };

  // Helper function to determine whether the controller account is the same as the stash account.
  const addressDifferentToStash = (address: MaybeAddress) => {
    // check if controller is imported.
    if (!connectAccounts.find((acc) => acc.address === address)) {
      return false;
    }
    return address !== activeAccount && activeAccount !== null;
  };

  // Helper function to determine whether the controller account has been imported.
  const getControllerNotImported = (address: MaybeAddress) => {
    if (address === null || !activeAccount) {
      return false;
    }
    // check if controller is imported
    const exists = connectAccounts.find((a) => a.address === address);
    if (exists === undefined) {
      return true;
    }
    // controller account exists. If it is a read-only account, then controller is imported.
    if (Object.prototype.hasOwnProperty.call(exists, 'addedBy')) {
      if ((exists as ExternalAccount).addedBy === 'user') {
        return false;
      }
    }
    // if the controller is a Ledger account, then it can act as a signer.
    if (exists.source === 'ledger') {
      return false;
    }
    // if a `signer` does not exist on the account, then controller is not imported.
    return !Object.prototype.hasOwnProperty.call(exists, 'signer');
  };

  // Helper function to determine whether the active account.
  const hasController = () => getBondedAccount(activeAccount) !== null;

  // Helper function to determine whether the active account is bonding, or is yet to start.
  const isBonding = () =>
    hasController() && greaterThanZero(getStashLedger(activeAccount).active);

  // Helper function to determine whether the active account.
  const isUnlocking = () =>
    hasController() && getStashLedger(activeAccount).unlocking.length;

  // Helper function to determine whether the active account is nominating, or is yet to start.
  const isNominating = () => getAccountNominations(activeAccount).length > 0;

  // Helper function to determine whether the active account is nominating, or is yet to start.
  const inSetup = () =>
    !activeAccount ||
    (!hasController() && !isBonding() && !isNominating() && !isUnlocking());

  // Helper function to get the lowest reward from an active validator.
  const getLowestRewardFromStaker = (address: MaybeAddress) => {
    const staker = eraStakersRef.current.stakers.find(
      (s) => s.address === address
    );
    const lowest = new BigNumber(staker?.lowestReward || 0);
    const oversubscribed = staker?.oversubscribed || false;

    return {
      lowest,
      oversubscribed,
    };
  };

  useEffectIgnoreInitial(() => {
    if (apiStatus === 'connecting') {
      setStateWithRef(defaultEraStakers, setEraStakers, eraStakersRef);
      setStakingMetrics(stakingMetrics);
    }
  }, [apiStatus]);

  // Handle staking metrics subscription
  useEffectIgnoreInitial(() => {
    if (isReady) {
      unsubscribeMetrics();
      subscribeToStakingkMetrics();
    }
    return () => {
      unsubscribeMetrics();
    };
  }, [isReady, activeEra, activeAccount]);

  // handle syncing with eraStakers
  useEffectIgnoreInitial(() => {
    if (isReady) fetchActiveEraStakers();
  }, [isReady, activeEra.index, activeAccount]);

  useEffectIgnoreInitial(() => {
    if (activeAccount) {
      // set account's targets
      setTargetsState(
        localStorageOrDefault(
          `${activeAccount}_targets`,
          defaultTargets,
          true
        ) as StakingTargets
      );
    }
  }, [isReady, bondedAccounts, activeAccount, eraStakersRef.current?.stakers]);

  return (
    <StakingContext.Provider
      value={{
        fetchEraStakers,
        getNominationsStatusFromTargets,
        setTargets,
        hasController,
        getControllerNotImported,
        addressDifferentToStash,
        isBonding,
        isNominating,
        inSetup,
        getLowestRewardFromStaker,
        staking: stakingMetrics,
        eraStakers: eraStakersRef.current,
        erasStakersSyncing: erasStakersSyncingRef.current,
        targets,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};

export const StakingContext = React.createContext<StakingContextInterface>(
  defaultStakingContext
);

export const useStaking = () => React.useContext(StakingContext);
