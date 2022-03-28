// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef, } from 'react';
import { useApi } from './Api';
import { useNetworkMetrics } from './Network';
import BN from "bn.js";

// validators per batch in multi-batch fetching
const VALIDATORS_PER_BATCH_MUTLI = 20;
const THROTTLE_VALIDATOR_RENDER = 250;

// context type
export interface StakingMetricsContextState {
  VALIDATORS_PER_BATCH_MUTLI: number,
  THROTTLE_VALIDATOR_RENDER: number,
  staking: any;
  session: any;
  meta: any;
  fetchValidators: () => void;
  fetchValidatorMetaBatch: (k: string, v: []) => void;
  getValidatorMetaBatch: (k: string) => any;
  removeValidatorMetaBatch: (k: string) => void;
}

// context definition
export const StakingMetricsContext: React.Context<StakingMetricsContextState> = React.createContext({
  VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
  THROTTLE_VALIDATOR_RENDER: THROTTLE_VALIDATOR_RENDER,
  staking: {},
  session: [],
  meta: {},
  fetchValidators: () => { },
  fetchValidatorMetaBatch: (k: string, v: []) => { },
  getValidatorMetaBatch: (k: string) => { },
  removeValidatorMetaBatch: (k: string) => { },
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

  const [sessionValidators, setValidators]: any = useState({
    session: [],
    unsub: null,
  });

  const [validatorMetaBatches, _setValidatorMetaBatch]: any = useState({
    meta: {},
    unsubs: [],
  });

  const validatorMetaBatchesRef = useRef(validatorMetaBatches);

  const setValidatorMetaBatch = (val: any) => {
    validatorMetaBatchesRef.current = val;
    _setValidatorMetaBatch(val);
  }

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


  /*
    Fetches a new batch of subscribed validator metadata. Stores the returning
    metadata alongside the unsubscribe function in state.
    structure:
    {
      key: {
        [
          {
          addresses [],
          prefs: [],
          identities: [],
        }
      ]
    },
  };
  */
  const fetchValidatorMetaBatch = async (key: string, validators: []) => {
    if (!isReady()) { return }

    if (!validators.length) { return; }

    // store batch addresses
    let batchesUpdated = Object.assign(validatorMetaBatches);
    batchesUpdated.meta[key] = {};
    batchesUpdated.meta[key].addresses = validators;
    setValidatorMetaBatch(batchesUpdated);

    // subscribe to identities
    const unsub = await api.query.identity.identityOf.multi(validators, (_identities: any) => {
      let identities = [];
      for (let i = 0; i < _identities.length; i++) {
        identities.push(_identities[i].toHuman());
      }
      // commit update
      let batchesUpdated = Object.assign(validatorMetaBatches);
      batchesUpdated.meta[key].identities = identities;
      setValidatorMetaBatch(batchesUpdated);
    });


    // subscribe to validator prefs
    const unsub2 = await api.query.staking.validators.multi(validators, (_validators: any) => {
      let prefs = [];
      for (let i = 0; i < _validators.length; i++) {
        prefs.push(_validators[i].toHuman());
      }
      // commit update
      let batchesUpdated = Object.assign(validatorMetaBatches);
      batchesUpdated.meta[key].prefs = prefs;
      setValidatorMetaBatch(batchesUpdated);
    });

    // commit unsubs
    const { unsubs } = validatorMetaBatches;
    unsubs.push([unsub, unsub2]);
    setValidatorMetaBatch({
      ...validatorMetaBatches,
      unsubs: unsubs,
    });
  }

  /* 
   * Fetches the currently active session's validator set.
   */
  const fetchValidators = async () => {
    if (!isReady()) { return }

    // subscribe to session validators
    const unsub = await api.queryMulti([
      api.query.session.validators,
    ], ([_sessionValidators,]: any) => {

      setValidators({
        ...sessionValidators,
        session: _sessionValidators.toHuman(),
      });
    });

    setValidators({
      ...sessionValidators,
      unsub: unsub,
    });
  }

  useEffect(() => {
    subscribeToStakingkMetrics(api);

    return (() => {

      // unsubscribe from staking metrics
      if (stakingMetrics.unsub !== null) {
        stakingMetrics.unsub();
      }

      // unsubscribe from session validators
      if (sessionValidators.unsub !== null) {
        sessionValidators.unsub();
      }

      // unsubscribe from any validator meta batches
      Object.entries(validatorMetaBatches.unsubs).map(([_, item]: any, index: number) => {
        for (let u of item) {
          u();
        }
      });
    })
  }, [isReady(), metrics.activeEra]);


  const removeValidatorMetaBatch = (key: string) => {
    if (validatorMetaBatches.meta[key] !== undefined) {
      delete validatorMetaBatches.meta[key];
    }
  }

  const getValidatorMetaBatch = (key: string) => {
    if (validatorMetaBatches.meta[key] === undefined) {
      return null;
    }
    return validatorMetaBatches.meta[key];
  }

  return (
    <StakingMetricsContext.Provider
      value={{
        VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
        THROTTLE_VALIDATOR_RENDER: THROTTLE_VALIDATOR_RENDER,
        fetchValidators: fetchValidators,
        fetchValidatorMetaBatch: fetchValidatorMetaBatch,
        getValidatorMetaBatch: getValidatorMetaBatch,
        removeValidatorMetaBatch: removeValidatorMetaBatch,
        staking: stakingMetrics,
        session: sessionValidators.session,
        meta: validatorMetaBatches.meta,
      }}>
      {props.children}
    </StakingMetricsContext.Provider>
  );
}