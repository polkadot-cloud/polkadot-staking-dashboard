// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import BN from 'bn.js';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Worker from 'worker-loader!../../workers/stakers';
import { rmCommas, localStorageOrDefault, setStateWithRef } from 'Utils';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { useApi } from '../Api';
import { useNetworkMetrics } from '../Network';
import { useBalances } from '../Balances';
import { useConnect } from '../Connect';
import * as defaults from './defaults';

export interface StakingContextState {
  getNominationsStatus: () => any;
  setTargets: (t: any) => any;
  hasController: () => any;
  getControllerNotImported: (a: string) => any;
  isBonding: () => any;
  isNominating: () => any;
  inSetup: () => any;
  staking: any;
  eraStakers: any;
  targets: any;
  erasStakersSyncing: any;
}

export const StakingContext: React.Context<StakingContextState> =
  React.createContext({
    getNominationsStatus: () => true,
    setTargets: (t: any) => false,
    hasController: () => false,
    getControllerNotImported: (a: string) => false,
    isBonding: () => false,
    isNominating: () => false,
    inSetup: () => false,
    staking: {},
    eraStakers: {},
    targets: [],
    erasStakersSyncing: false,
  });

export const useStaking = () => React.useContext(StakingContext);

export const StakingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    activeAccount,
    accounts: connectAccounts,
    getActiveAccount,
  } = useConnect() as ConnectContextInterface;
  const { isReady, api, consts, status, network } =
    useApi() as APIContextInterface;
  const { metrics }: any = useNetworkMetrics();
  const {
    accounts,
    getBondedAccount,
    getAccountLedger,
    getAccountNominations,
  }: any = useBalances();
  const { maxNominatorRewardedPerValidator } = consts;

  // store staking metrics in state
  const [stakingMetrics, setStakingMetrics]: any = useState(
    defaults.stakingMetrics
  );

  // store stakers metadata in state
  const [eraStakers, setEraStakers]: any = useState(defaults.eraStakers);
  const eraStakersRef = useRef(eraStakers);

  // flags whether erasStakers is resyncing
  const [erasStakersSyncing, setErasStakersSyncing] = useState(false);
  const erasStakersSyncingRef = useRef(erasStakersSyncing);

  // store account target validators
  const [targets, _setTargets]: any = useState(
    localStorageOrDefault(
      `${activeAccount ?? ''}_targets`,
      defaults.targets,
      true
    )
  );

  const worker = new Worker();

  worker.onmessage = (message: any) => {
    if (message) {
      const { data } = message;
      const {
        stakers,
        activeNominators,
        activeValidators,
        minActiveBond,
        ownStake,
        _activeAccount,
      } = data;

      // finish sync
      setStateWithRef(false, setErasStakersSyncing, erasStakersSyncingRef);

      // check if account hasn't changed since worker started
      if (getActiveAccount() === _activeAccount) {
        setStateWithRef(
          {
            ...eraStakersRef.current,
            stakers,
            activeNominators,
            activeValidators,
            minActiveBond,
            ownStake,
          },
          setEraStakers,
          eraStakersRef
        );
      }
    }
  };

  const subscribeToStakingkMetrics = async (_api: any) => {
    if (isReady && metrics.activeEra.index !== 0) {
      const previousEra = metrics.activeEra.index - 1;

      // subscribe to staking metrics
      const unsub = await _api.queryMulti(
        [
          _api.query.staking.counterForNominators,
          _api.query.staking.counterForValidators,
          _api.query.staking.maxNominatorsCount,
          _api.query.staking.maxValidatorsCount,
          _api.query.staking.validatorCount,
          [_api.query.staking.erasValidatorReward, previousEra],
          [_api.query.staking.erasTotalStake, previousEra],
          _api.query.staking.minNominatorBond,
          _api.query.staking.historyDepth,
          [_api.query.staking.payee, activeAccount],
        ],
        ([
          _totalNominators,
          _totalValidators,
          _maxNominatorsCount,
          _maxValidatorsCount,
          _validatorCount,
          _lastReward,
          _lastTotalStake,
          _minNominatorBond,
          _historyDepth,
          _payee,
        ]: any) => {
          setStakingMetrics({
            ...stakingMetrics,
            payee: Object.keys(_payee.toHuman())[0],
            historyDepth: _historyDepth.toBn(),
            lastTotalStake: _lastTotalStake.toBn(),
            validatorCount: _validatorCount.toBn(),
            totalNominators: _totalNominators.toBn(),
            totalValidators: _totalValidators.toBn(),
            minNominatorBond: _minNominatorBond.toBn(),
            lastReward: _lastReward.unwrapOrDefault(new BN(0)),
            maxValidatorsCount: new BN(_maxValidatorsCount.toString()),
            maxNominatorsCount: new BN(_maxNominatorsCount.toString()),
          });
        }
      );

      setStakingMetrics({
        ...stakingMetrics,
        unsub,
      });
    }
  };

  /*
   * Fetches the active nominator set.
   * The top 256 nominators get rewarded. Nominators may have their bond  spread
   * among multiple nominees.
   * the minimum nominator bond is calculated by summing a particular bond of a nominator.
   */
  const fetchEraStakers = async () => {
    if (!isReady || metrics.activeEra.index === 0 || !api) {
      return;
    }
    const _exposures = await api.query.staking.erasStakers.entries(
      metrics.activeEra.index
    );

    // flag eraStakers is recyncing
    setStateWithRef(true, setErasStakersSyncing, erasStakersSyncingRef);

    // humanise exposures to send to worker
    const exposures = _exposures.map(([_keys, _val]: any) => ({
      keys: _keys.toHuman(),
      val: _val.toHuman(),
    }));

    // worker to calculate stats
    worker.postMessage({
      activeAccount,
      units: network.units,
      exposures,
      maxNominatorRewardedPerValidator,
    });
  };

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
   */
  const getNominationsStatus = () => {
    if (inSetup()) {
      return defaults.nominationStatus;
    }
    const nominations = getAccountNominations(activeAccount);
    const statuses: any = {};

    for (const nomination of nominations) {
      const s = eraStakersRef.current.stakers.find(
        (_n: any) => _n.address === nomination
      );

      if (s === undefined) {
        statuses[nomination] = 'waiting';
        continue;
      }
      const exists = (s.others ?? []).find(
        (_o: any) => _o.who === activeAccount
      );
      if (exists === undefined) {
        statuses[nomination] = 'inactive';
        continue;
      }
      statuses[nomination] = 'active';
    }

    return statuses;
  };

  useEffect(() => {
    if (status === 'connecting') {
      setStateWithRef(defaults.eraStakers, setEraStakers, eraStakersRef);
      setStakingMetrics(defaults.stakingMetrics);
    }
  }, [status]);

  // handle staking metrics subscription
  useEffect(() => {
    if (isReady) {
      subscribeToStakingkMetrics(api);
    }
    return () => {
      // unsubscribe from staking metrics
      if (stakingMetrics.unsub !== null) {
        stakingMetrics.unsub();
      }
    };
  }, [isReady, metrics.activeEra]);

  // handle syncing with eraStakers
  useEffect(() => {
    if (isReady) {
      fetchEraStakers();
    }
  }, [isReady, metrics.activeEra.index, activeAccount]);

  useEffect(() => {
    if (activeAccount) {
      // calculates minimum bond of the user's chosen nominated validators.
      let _stakingMinActiveBond = new BN(0);

      const stakers = eraStakersRef.current?.stakers ?? null;
      const nominations = getAccountNominations(activeAccount);

      if (nominations.length && stakers !== null) {
        for (const n of nominations) {
          const staker = stakers.find((item: any) => item.address === n);

          if (staker !== undefined) {
            let { others } = staker;

            // order others by bonded value, largest first.
            others = others.sort((a: any, b: any) => {
              const x = new BN(rmCommas(a.value));
              const y = new BN(rmCommas(b.value));
              return y.sub(x);
            });

            if (others.length) {
              const _minActive = new BN(rmCommas(others[0].value.toString()));
              // set new minimum active bond if less than current value
              if (
                _minActive.lt(_stakingMinActiveBond) ||
                _stakingMinActiveBond !== new BN(0)
              ) {
                _stakingMinActiveBond = _minActive;
              }
            }
          }
        }
      }

      // convert _stakingMinActiveBond to base value
      const stakingMinActiveBond = _stakingMinActiveBond
        .div(new BN(10 ** network.units))
        .toNumber();

      setStateWithRef(
        {
          ...eraStakersRef.current,
          minStakingActiveBond: stakingMinActiveBond,
        },
        setEraStakers,
        eraStakersRef
      );

      // set account's targets
      _setTargets(
        localStorageOrDefault(
          `${activeAccount}_targets`,
          defaults.targets,
          true
        )
      );
    }
  }, [isReady, accounts, activeAccount, eraStakersRef.current?.stakers]);

  /* Sets an account's stored target validators */
  const setTargets = (_targets: any) => {
    localStorage.setItem(`${activeAccount}_targets`, JSON.stringify(_targets));
    _setTargets(_targets);
    return [];
  };

  /*
   * Helper function to determine whether the active account
   * has set a controller account.
   */
  const hasController = () => {
    if (!activeAccount) {
      return false;
    }
    return getBondedAccount(activeAccount) !== null;
  };

  /*
   * Helper function to determine whether the controller account
   * has been imported.
   */
  const getControllerNotImported = (address: string) => {
    if (address === null || !activeAccount) {
      return false;
    }
    // check if controller is imported
    const exists = connectAccounts.find((acc: any) => acc.address === address);
    return !exists;
  };

  /*
   * Helper function to determine whether the active account
   * is bonding, or is yet to start.
   */
  const isBonding = () => {
    if (!hasController()) {
      return false;
    }
    const ledger = getAccountLedger(activeAccount);
    return ledger.active.gt(new BN(0));
  };

  /*
   * Helper function to determine whether the active account
   * has funds unlocking.
   */
  const isUnlocking = () => {
    if (!hasController()) {
      return false;
    }
    const ledger = getAccountLedger(activeAccount);
    return ledger.unlocking.length;
  };

  /*
   * Helper function to determine whether the active account
   * is nominating, or is yet to start.
   */
  const isNominating = () => {
    const nominations = getAccountNominations(activeAccount);
    return nominations.length > 0;
  };

  /*
   * Helper function to determine whether the active account
   * is nominating, or is yet to start.
   */
  const inSetup = () => {
    return (
      !activeAccount ||
      (!hasController() && !isBonding() && !isNominating() && !isUnlocking())
    );
  };

  return (
    <StakingContext.Provider
      value={{
        getNominationsStatus,
        setTargets,
        hasController,
        getControllerNotImported,
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
