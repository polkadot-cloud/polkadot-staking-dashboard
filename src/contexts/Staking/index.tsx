// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  greaterThanZero,
  localStorageOrDefault,
  rmCommas,
  setStateWithRef,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useBalances } from 'contexts/Balances';
import type { ExternalAccount } from '@polkadot-cloud/react/types';
import type {
  EraStakers,
  Exposure,
  ExposureOther,
  StakingContextInterface,
  StakingTargets,
} from 'contexts/Staking/types';
import type { AnyApi, MaybeAddress } from 'types';
import Worker from 'workers/stakers?worker';
import type { ProcessExposuresResponse } from 'workers/types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useApi } from '../Api';
import { useBonded } from '../Bonded';
import {
  defaultEraStakers,
  defaultStakingContext,
  defaultTargets,
} from './defaults';
import {
  setLocalEraExposures,
  getLocalEraExposures,
  formatRawExposures,
} from './Utils';
import type { NominationStatus } from 'library/ValidatorList/ValidatorItem/types';

const worker = new Worker();

export const StakingContext = createContext<StakingContextInterface>(
  defaultStakingContext
);

export const useStaking = () => useContext(StakingContext);

export const StakingProvider = ({ children }: { children: ReactNode }) => {
  const { getLedger } = useBalances();
  const { isReady, api, apiStatus, consts, activeEra, isPagedRewardsActive } =
    useApi();
  const { networkData, network } = useNetwork();
  const { accounts: connectAccounts } = useImportedAccounts();
  const { activeAccount, getActiveAccount } = useActiveAccounts();
  const { bondedAccounts, getBondedAccount, getAccountNominations } =
    useBonded();
  const { maxExposurePageSize } = consts;

  // Store eras stakers in state.
  const [eraStakers, setEraStakers] = useState<EraStakers>(defaultEraStakers);
  const eraStakersRef = useRef(eraStakers);

  // Flags whether `eraStakers` is resyncing.
  const [erasStakersSyncing, setErasStakersSyncing] = useState<boolean>(false);
  const erasStakersSyncingRef = useRef(erasStakersSyncing);

  // Store target validators for the active account.
  const [targets, setTargetsState] = useState<StakingTargets>(
    localStorageOrDefault<StakingTargets>(
      `${activeAccount ?? ''}_targets`,
      defaultTargets,
      true
    ) as StakingTargets
  );

  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data }: { data: ProcessExposuresResponse } = message;
      const { task, networkName, era } = data;

      // ensure task matches, & era is still the same.
      if (
        task !== 'processExposures' ||
        networkName !== network ||
        era !== activeEra.index.toString()
      ) {
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

  // Fetches erasStakers exposures for an era, and saves to `localStorage`.
  const fetchEraStakers = async (era: string) => {
    if (!isReady || activeEra.index.isZero() || !api) {
      return [];
    }

    let exposures: Exposure[] = [];
    const localExposures = getLocalEraExposures(
      network,
      era,
      activeEra.index.toString()
    );

    if (localExposures) {
      exposures = localExposures;
    } else {
      exposures = await getPagedErasStakers(era);
    }

    // For resource limitation concerns, only store the current era in local storage.
    if (era === activeEra.index.toString()) {
      setLocalEraExposures(network, era, exposures);
    }

    return exposures;
  };

  // Fetches the active nominator set and metadata around it.
  const fetchActiveEraStakers = async () => {
    if (!isReady || activeEra.index.isZero() || !api) {
      return;
    }

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
      maxExposurePageSize: maxExposurePageSize.toNumber(),
    });
  };

  // Sets an account's stored target validators.
  const setTargets = (value: StakingTargets): void => {
    localStorage.setItem(`${activeAccount}_targets`, JSON.stringify(value));
    setTargetsState(value);
  };

  // Gets the nomination statuses of passed in nominations.
  const getNominationsStatusFromTargets = (
    who: MaybeAddress,
    fromTargets: string[]
  ) => {
    const statuses: Record<string, NominationStatus> = {};

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

      if (!(staker.others ?? []).find((o) => o.who === who)) {
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
    hasController() &&
    greaterThanZero(getLedger({ stash: activeAccount }).active);

  // Helper function to determine whether the active account.
  const isUnlocking = () =>
    hasController() && getLedger({ stash: activeAccount }).unlocking.length;

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

  // If paged rewards are active for the era, fetch eras stakers from the new storage items,
  // otherwise use the old storage items.
  const getPagedErasStakers = async (era: string) => {
    if (!api) {
      return [];
    }

    if (isPagedRewardsActive(new BigNumber(era))) {
      const overview: AnyApi =
        await api.query.staking.erasStakersOverview.entries(era);

      const validators = overview.reduce(
        (prev: Record<string, Exposure>, [keys, value]: AnyApi) => {
          const validator = keys.toHuman()[1];
          const { own, total } = value.toHuman();
          return { ...prev, [validator]: { own, total } };
        },
        {}
      );
      const validatorKeys = Object.keys(validators);

      const pagedResults = await Promise.all(
        validatorKeys.map((v) =>
          api.query.staking.erasStakersPaged.entries(era, v)
        )
      );

      const result: Exposure[] = [];
      let i = 0;
      for (const pagedResult of pagedResults) {
        const validator = validatorKeys[i];
        const { own, total } = validators[validator];
        const others = pagedResult.reduce(
          (prev: ExposureOther[], [, v]: AnyApi) => {
            const o = v.toHuman()?.others || [];
            if (!o.length) {
              return prev;
            }
            return prev.concat(o);
          },
          []
        );

        result.push({
          keys: [rmCommas(era), validator],
          val: {
            total: rmCommas(total),
            own: rmCommas(own),
            others: others.map(({ who, value }) => ({
              who,
              value: rmCommas(value),
            })),
          },
        });
        i++;
      }
      return result;
    }

    // DEPRECATION: Paged Rewards
    //
    // Use legacy `erasStakers` storage item.
    const result = await api.query.staking.erasStakers.entries(era);
    return formatRawExposures(result);
  };

  useEffectIgnoreInitial(() => {
    if (apiStatus === 'connecting') {
      setStateWithRef(defaultEraStakers, setEraStakers, eraStakersRef);
    }
  }, [apiStatus]);

  // handle syncing with eraStakers
  useEffectIgnoreInitial(() => {
    if (isReady) {
      fetchActiveEraStakers();
    }
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
        eraStakers: eraStakersRef.current,
        erasStakersSyncing: erasStakersSyncingRef.current,
        targets,
        getPagedErasStakers,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};
