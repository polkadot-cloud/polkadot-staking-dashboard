// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoidFn } from '@polkadot/api/types';
import {
  greaterThanZero,
  isNotZero,
  localStorageOrDefault,
  setStateWithRef,
} from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useBalances } from 'contexts/Balances';
import type { ExternalAccount } from 'contexts/Connect/types';
import type { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import type {
  EraStakers,
  NominationStatuses,
  StakingContextInterface,
  StakingMetrics,
  StakingTargets,
} from 'contexts/Staking/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, AnyJson, MaybeAccount } from 'types';
import Worker from 'workers/stakers?worker';
import { useApi } from '../Api';
import { useBonded } from '../Bonded';
import { useConnect } from '../Connect';
import { useNetworkMetrics } from '../Network';
import {
  defaultEraStakers,
  defaultNominationStatus,
  defaultStakingContext,
  defaultStakingMetrics,
  defaultTargets,
} from './defaults';

const worker = new Worker();

export const StakingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api, apiStatus, network } = useApi();
  const {
    activeAccount,
    accounts: connectAccounts,
    getActiveAccount,
  } = useConnect();
  const { activeEra } = useNetworkMetrics();
  const { getStashLedger } = useBalances();
  const { bondedAccounts, getBondedAccount, getAccountNominations } =
    useBonded();

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

  useEffect(() => {
    if (apiStatus === 'connecting') {
      setStateWithRef(defaultEraStakers, setEraStakers, eraStakersRef);
      setStakingMetrics(stakingMetrics);
    }
  }, [apiStatus]);

  // handle staking metrics subscription
  useEffect(() => {
    if (isReady) {
      unsubscribeMetrics();
      subscribeToStakingkMetrics();
    }
    return () => {
      unsubscribeMetrics();
    };
  }, [isReady, activeEra, activeAccount]);

  // Handle metrics unsubscribe.
  const unsubscribeMetrics = () => {
    if (unsub.current !== null) {
      unsub.current();
      unsub.current = null;
    }
  };

  // handle syncing with eraStakers
  useEffect(() => {
    if (isReady) {
      fetchEraStakers();
    }
  }, [isReady, activeEra.index, activeAccount]);

  useEffect(() => {
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

  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task } = data;
      if (task !== 'initialise_exposures') {
        return;
      }
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

  // subscribe to account ledger
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
        (q: AnyApi) => {
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

  // process raw payee object from API. payee with `Account` type is returned as an key value pair,
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
      const account = `${payeeEntry[0][1]}` as MaybeAccount;
      payeeFinal = {
        destination,
        account,
      };
    }
    return payeeFinal;
  };

  /*
   * Fetches the active nominator set.
   * The top 256 nominators get rewarded. Nominators may have their bond  spread
   * among multiple nominees.
   * the minimum nominator bond is calculated by summing a particular bond of a nominator.
   */
  const fetchEraStakers = async () => {
    if (!isReady || activeEra.isPlaceholder || !api) {
      return;
    }
    const exposuresRaw = await api.query.staking.erasStakers.entries(
      activeEra.index.toString()
    );

    // flag eraStakers is recyncing
    setStateWithRef(true, setErasStakersSyncing, erasStakersSyncingRef);

    // humanise exposures to send to worker
    const exposures = exposuresRaw.map(([keys, val]: AnyApi) => ({
      keys: keys.toHuman(),
      val: val.toHuman(),
    }));

    // worker to calculate stats
    worker.postMessage({
      task: 'initialise_exposures',
      activeAccount,
      units: network.units,
      exposures,
    });
  };

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
   */
  const getNominationsStatus = () => {
    if (inSetup() || !activeAccount) {
      return defaultNominationStatus;
    }
    const statuses: NominationStatuses = {};
    for (const nomination of getAccountNominations(activeAccount)) {
      const s = eraStakersRef.current.stakers.find(
        ({ address }) => address === nomination
      );

      if (s === undefined) {
        statuses[nomination] = 'waiting';
        continue;
      }
      if (!(s.others ?? []).find(({ who }: any) => who === activeAccount)) {
        statuses[nomination] = 'inactive';
        continue;
      }
      statuses[nomination] = 'active';
    }
    return statuses;
  };

  /* Sets an account's stored target validators */
  const setTargets = (value: StakingTargets) => {
    localStorage.setItem(`${activeAccount}_targets`, JSON.stringify(value));
    setTargetsState(value);
  };

  /*
   * Gets the nomination statuses of passed in nominations.
   */
  const getNominationsStatusFromTargets = (
    who: MaybeAccount,
    fromTargets: AnyJson[]
  ) => {
    const statuses: Record<string, string> = {};

    if (!fromTargets.length) {
      return statuses;
    }

    for (const target of fromTargets) {
      const staker = eraStakersRef.current.stakers.find(
        ({ address }: any) => address === target
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

  /*
   * Helper function to determine whether the controller account
   * is the same as the stash account.
   */
  const addressDifferentToStash = (address: MaybeAccount) => {
    // check if controller is imported.
    if (!connectAccounts.find((acc) => acc.address === address)) {
      return false;
    }
    return address !== activeAccount && activeAccount !== null;
  };

  /*
   * Helper function to determine whether the controller account
   * has been imported.
   */
  const getControllerNotImported = (address: MaybeAccount) => {
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

  /*
   * Helper function to determine whether the active account
   * has set a controller account.
   */
  const hasController = () => getBondedAccount(activeAccount) !== null;

  /*
   * Helper function to determine whether the active account
   * is bonding, or is yet to start.
   */
  const isBonding = () =>
    hasController() && greaterThanZero(getStashLedger(activeAccount).active);

  /*
   * Helper function to determine whether the active account
   * has funds unlocking.
   */
  const isUnlocking = () =>
    hasController() && getStashLedger(activeAccount).unlocking.length;

  /*
   * Helper function to determine whether the active account
   * is nominating, or is yet to start.
   */
  const isNominating = () => getAccountNominations(activeAccount).length > 0;

  /*
   * Helper function to determine whether the active account
   * is nominating, or is yet to start.
   */
  const inSetup = () =>
    !activeAccount ||
    (!hasController() && !isBonding() && !isNominating() && !isUnlocking());

  return (
    <StakingContext.Provider
      value={{
        getNominationsStatus,
        getNominationsStatusFromTargets,
        setTargets,
        hasController,
        getControllerNotImported,
        addressDifferentToStash,
        isBonding,
        isNominating,
        inSetup,
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
