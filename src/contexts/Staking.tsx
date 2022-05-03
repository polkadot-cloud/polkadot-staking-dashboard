// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { useApi } from './Api';
import { useNetworkMetrics } from './Network';
import { useBalances } from './Balances';
import { useConnect } from './Connect';
import BN from "bn.js";
import { rmCommas } from '../Utils';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!../workers/fibo.worker";

const worker = new Worker();

// context type
export interface StakingContextState {
  getNominationsStatus: () => any;
  hasController: () => any;
  isBonding: () => any;
  isNominating: () => any;
  inSetup: () => any;
  staking: any;
  eraStakers: any;
}

// context definition
export const StakingContext: React.Context<StakingContextState> = React.createContext({
  getNominationsStatus: () => { },
  hasController: () => false,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => false,
  staking: {},
  eraStakers: {},
});

// useStaking
export const useStaking = () => React.useContext(StakingContext);

// wrapper component to provide components with context
export const StakingContextWrapper = (props: any) => {

  const { activeAccount } = useConnect();
  const { isReady, api, consts }: any = useApi();
  const { maxNominatorRewardedPerValidator } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { accounts, getBondedAccount, getAccountLedger, getAccountNominations }: any = useBalances();

  const [stakingMetrics, setStakingMetrics]: any = useState({
    totalNominators: 0,
    totalValidators: 0,
    lastReward: 0,
    lastTotalStake: 0,
    validatorCount: 0,
    maxNominatorsCount: 0,
    maxValidatorsCount: 0,
    minNominatorBond: 0,
    historyDepth: 0,
    unsub: null,
  });

  const [eraStakers, _setEraStakers]: any = useState({
    stakers: [],
    activeNominators: 0,
    activeValidators: 0,
    minActiveBond: 0,
    minStakingActiveBond: 0,
  });

  const eraStakersRef = useRef(eraStakers);
  const setEraStakers = (val: any) => {
    eraStakersRef.current = val;
    _setEraStakers(val);
  }

  const subscribeToStakingkMetrics = async (api: any) => {
    if (isReady && metrics.activeEra.index !== 0) {
      const previousEra = metrics.activeEra.index - 1;

      // subscribe to staking metrics
      const unsub = await api.queryMulti([
        api.query.staking.counterForNominators,
        api.query.staking.counterForValidators,
        api.query.staking.maxNominatorsCount,
        api.query.staking.maxValidatorsCount,
        api.query.staking.validatorCount,
        [api.query.staking.erasValidatorReward, previousEra],
        [api.query.staking.erasTotalStake, previousEra],
        api.query.staking.minNominatorBond,
        api.query.staking.historyDepth,
        [api.query.staking.payee, activeAccount]
      ], ([
        _totalNominators,
        _totalValidators,
        _maxNominatorsCount,
        _maxValidatorsCount,
        _validatorCount,
        _lastReward,
        _lastTotalStake,
        _minNominatorBond,
        _historyDepth,
        _payee
      ]: any) => {

        // format lastReward DOT unit
        _lastReward = _lastReward.unwrapOrDefault(0);
        _lastReward = _lastReward === 0
          ? 0
          : new BN(_lastReward.toNumber() / (10 ** 10));

        // format lastTotalState DOT unit
        _lastTotalStake = new BN(_lastTotalStake / (10 ** 10)).toNumber();

        setStakingMetrics({
          ...stakingMetrics,
          totalNominators: _totalNominators.toNumber(),
          totalValidators: _totalValidators.toNumber(),
          lastReward: _lastReward,
          lastTotalStake: _lastTotalStake,
          validatorCount: _validatorCount.toNumber(),
          maxNominatorsCount: Number(_maxNominatorsCount.toString()),
          maxValidatorsCount: Number(_maxValidatorsCount.toString()),
          minNominatorBond: _minNominatorBond.toNumber(),
          historyDepth: _historyDepth.toNumber(),
          payee: _payee.toHuman(),
        });
      });

      setStakingMetrics({
        ...stakingMetrics,
        unsub: unsub,
      });
    }
  }

  /* 
   * Fetches the active nominator set.
   * The top 256 nominators get rewarded. Nominators may have their bond  spread
   * among multiple nominees.
   * the minimum nominator bond is calculated by summing a particular bond of a nominator.
   */
  const fetchEraStakers = async () => {
    if (!isReady || metrics.activeEra.index === 0) { return }

    const _exposures = await api.query.staking.erasStakers.entries(metrics.activeEra.index);

    // humanise exposures to send to worker
    let exposures = _exposures.map(([_keys, _val]: any) => ({
      keys: _keys.toHuman(),
      val: _val.toHuman(),
    }));

    // worker to calculate stats
    worker.postMessage({
      exposures: exposures,
      maxNominatorRewardedPerValidator: maxNominatorRewardedPerValidator,
    });
  }

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
  */
  const getNominationsStatus = () => {
    const nominations = getAccountNominations(activeAccount);
    let statuses: any = {};

    for (let nomination of nominations) {
      let status = eraStakersRef.current.stakers.find((_n: any) => _n.address === nomination);

      if (status === undefined) {
        statuses[nomination] = 'waiting';
        continue;
      }
      let exists = (status.others ?? []).find((_o: any) => _o.who === activeAccount);
      if (exists === undefined) {
        statuses[nomination] = 'inactive';
        continue;
      }
      statuses[nomination] = 'active';
    }

    return statuses;
  }

  useEffect(() => {
    if (isReady) {
      fetchEraStakers();
      subscribeToStakingkMetrics(api);
    }
    return (() => {
      // unsubscribe from staking metrics
      if (stakingMetrics.unsub !== null) {
        stakingMetrics.unsub();
      }
    })
  }, [isReady, metrics.activeEra]);

  useEffect(() => {
    worker.onmessage = (message: any) => {
      if (message) {
        const { data } = message;

        const {
          stakers,
          activeNominators,
          activeValidators,
          minActiveBond
        } = data;

        setEraStakers({
          ...eraStakersRef.current,
          stakers: stakers,
          activeNominators: activeNominators,
          activeValidators: activeValidators,
          minActiveBond: minActiveBond,
        });
      }
    };
  }, []);

  // calculates minimum bond of the user's chosen nominated validators.
  useEffect(() => {

    let _stakingMinActiveBond = new BN(0);
    const stakers = eraStakersRef.current?.stakers ?? null;
    const nominations = getAccountNominations(activeAccount);

    if (nominations.length && stakers !== null) {
      for (let n of nominations) {
        let staker = stakers.find((item: any) => item.address === n);

        if (staker !== undefined) {
          let { others } = staker;
          others = others.sort((a: any, b: any) => {
            let x = new BN(rmCommas(a.value));
            let y = new BN(rmCommas(b.value));
            return x.sub(y);
          });

          if (others.length) {
            let _min = new BN(rmCommas(others[0].value.toString()));
            if ((_min.lt(_stakingMinActiveBond)) || _stakingMinActiveBond.toNumber() === 0) {
              _stakingMinActiveBond = _min;
            }
          }
        }
      }
    }

    // convert _stakingMinActiveBond to DOT value
    let stakingMinActiveBond = _stakingMinActiveBond.div(new BN(10 ** 10)).toNumber();

    setEraStakers({
      ...eraStakersRef.current,
      minStakingActiveBond: stakingMinActiveBond
    });

  }, [isReady, accounts, activeAccount, eraStakersRef.current?.stakers]);


  /*
   * Helper function to determine whether the active account
   * has set a controller account.
   */
  const hasController = () => {
    return getBondedAccount(activeAccount) === null ? false : true;
  }

  /*
   * Helper function to determine whether the active account
   * is bonding, or is yet to start.
   */
  const isBonding = () => {
    if (!hasController()) {
      return false;
    }
    const ledger = getAccountLedger(getBondedAccount(activeAccount));
    return ledger.active > 0;
  }

  /*
   * Helper function to determine whether the active account
   * is nominating, or is yet to start.
   */
  const isNominating = () => {
    const nominations = getAccountNominations(activeAccount);
    return nominations.length > 0;
  }

  /*
   * Helper function to determine whether the active account
   * is nominating, or is yet to start.
   */
  const inSetup = () => {
    return (!hasController || !isBonding() || !isNominating());
  }

  return (
    <StakingContext.Provider
      value={{
        getNominationsStatus: getNominationsStatus,
        hasController: hasController,
        isBonding: isBonding,
        isNominating: isNominating,
        inSetup: inSetup,
        staking: stakingMetrics,
        eraStakers: eraStakersRef.current,
      }}>
      {props.children}
    </StakingContext.Provider>
  );
}