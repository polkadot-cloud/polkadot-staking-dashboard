// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useApi } from './Api';
import { useNetworkMetrics } from './Network';
import BN from "bn.js";

// context type
export interface StakingMetricsContextState {
  staking: any;
  validators: any;
  fetchSessionValidators: () => void;
}

// context definition
export const StakingMetricsContext: React.Context<StakingMetricsContextState> = React.createContext({
  staking: {},
  validators: [],
  fetchSessionValidators: () => { },
});

// useStakingMetrics
export const useStakingMetrics = () => React.useContext(StakingMetricsContext);

// wrapper component to provide components with context
export const StakingMetricsContextWrapper = (props: any) => {

  const { isReady, api }: any = useApi();
  const { metrics }: any = useNetworkMetrics();

  const [stakingMetrics, setStakingMetrics]: any = useState({
    lastReward: 0,
    lastTotalStake: 0,
    totalNominators: 0,
    maxNominatorsCount: 0,
    maxValidatorsCount: 0,
    minNominatorBond: 0,
    unsub: null,
  });

  const [sessionValidators, setSessionValidators]: any = useState({
    validators: [],
    unsub: null,
  });

  const subscribeToStakingkMetrics = async (api: any) => {
    if (isReady() && metrics.activeEra.index !== 0) {
      const previousEra = metrics.activeEra.index - 1;

      // subscribe to staking metrics
      const unsub = await api.queryMulti([
        api.query.staking.counterForNominators,
        api.query.staking.maxNominatorsCount,
        api.query.staking.maxValidatorsCount,
        [api.query.staking.erasValidatorReward, previousEra],
        [api.query.staking.erasTotalStake, previousEra],
        api.query.staking.minNominatorBond,
        api.query.staking.historyDepth,
      ], ([_totalNominators, _maxNominatorsCount, _maxValidatorsCount, _lastReward, _lastTotalStake, _minNominatorBond, _historyDepth]: any) => {

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
          lastReward: _lastReward,
          lastTotalStake: _lastTotalStake,
          maxNominatorsCount: _maxNominatorsCount.toString(),
          maxValidatorsCount: _maxValidatorsCount.toString(),
          minNominatorBond: _minNominatorBond.toString(),
          historyDepth: _historyDepth.toNumber(),
        });
      });

      setStakingMetrics({
        ...stakingMetrics,
        unsub: unsub,
      });
    }
  }

  const fetchSessionValidators = async () => {

    if (!isReady())
      return;

    // subscribe to session validators
    const unsub = await api.queryMulti([
      api.query.session.validators,
    ], ([_validators]: any) => {

      setSessionValidators({
        ...sessionValidators,
        validators: _validators.toHuman(),
      });
    });

    setSessionValidators({
      ...sessionValidators,
      unsub: unsub,
    });
  }

  useEffect(() => {
    subscribeToStakingkMetrics(api);

    return (() => {
      if (stakingMetrics.unsub !== null) {
        stakingMetrics.unsub();
      }

      if (sessionValidators.unsub !== null) {
        sessionValidators.unsub();
      }
    })
  }, [isReady(), metrics.activeEra]);

  return (
    <StakingMetricsContext.Provider
      value={{
        fetchSessionValidators: fetchSessionValidators,
        staking: stakingMetrics,
        validators: sessionValidators.validators,
      }}>
      {props.children}
    </StakingMetricsContext.Provider>
  );
}