// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef, } from 'react';
import { useApi } from './Api';
import { useNetworkMetrics } from './Network';
import BN from "bn.js";
import { sleep, removePercentage } from '../Utils';

// validators per batch in multi-batch fetching
const VALIDATORS_PER_BATCH_MUTLI = 20;
const THROTTLE_VALIDATOR_RENDER = 250;

// context type
export interface StakingMetricsContextState {
  VALIDATORS_PER_BATCH_MUTLI: number,
  THROTTLE_VALIDATOR_RENDER: number,
  fetchValidators: () => void;
  fetchValidatorMetaBatch: (k: string, v: []) => void;
  getValidatorMetaBatch: (k: string) => any;
  removeValidatorMetaBatch: (k: string) => void;
  fetchValidatorPrefs: (v: any) => any;
  staking: any;
  session: any;
  meta: any;
}

// context definition
export const StakingMetricsContext: React.Context<StakingMetricsContextState> = React.createContext({
  VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
  THROTTLE_VALIDATOR_RENDER: THROTTLE_VALIDATOR_RENDER,
  fetchValidators: () => { },
  fetchValidatorMetaBatch: (k: string, v: []) => { },
  getValidatorMetaBatch: (k: string) => { },
  removeValidatorMetaBatch: (k: string) => { },
  fetchValidatorPrefs: (v: any) => { },
  staking: {},
  session: [],
  meta: {},
});

// useStaking
export const useStaking = () => React.useContext(StakingMetricsContext);

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
  });

  const [validatorMetaBatches, _setValidatorMetaBatch]: any = useState({
    meta: {},
    unsubs: {},
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
   * Fetches the currently active session's validator set.
   * Validator meta batches are derived from this initial list.
   */
  const fetchValidators = async () => {
    if (!isReady()) { return }

    let validators: any = [];
    const exposures = await api.query.staking.validators.entries();
    exposures.forEach(([_args, _prefs]: any) => {
      let address = _args.args[0].toHuman();
      let prefs = _prefs.toHuman();

      let _commission = removePercentage(prefs.commission);

      validators.push({
        address: address,
        prefs: {
          commission: parseFloat(_commission.toFixed(2)),
          blocked: prefs.blocked
        }
      });
    });

    setValidators({
      session: validators,
    });
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
          identities: [],
        }
      ]
    },
  };
  */
  const fetchValidatorMetaBatch = async (key: string, validators: any, refetch: boolean = false) => {
    if (!isReady()) { return }

    if (!validators.length) { return; }

    if (!refetch) {
      // if already exists, do not re-fetch
      if (validatorMetaBatches.unsubs[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      delete validatorMetaBatches[key];
      if (validatorMetaBatches.unsubs[key] !== undefined) {
        for (let unsub of validatorMetaBatches.unsubs[key]) {
          unsub();
        }
      }
    }

    let addresses = [];
    for (let v of validators) {
      addresses.push(v.address);
    }

    // store batch addresses
    let batchesUpdated = Object.assign(validatorMetaBatches);
    batchesUpdated.meta[key] = {};
    batchesUpdated.meta[key].addresses = addresses;
    setValidatorMetaBatch(batchesUpdated);

    // subscribe to identities
    const unsub = await api.query.identity.identityOf.multi(addresses, (_identities: any) => {
      let identities = [];
      for (let i = 0; i < _identities.length; i++) {
        identities.push(_identities[i].toHuman());
      }
      // commit update
      let batchesUpdated = Object.assign(validatorMetaBatches);
      batchesUpdated.meta[key].identities = identities;
      setValidatorMetaBatch(batchesUpdated);
    });

    // intentional throttle to prevent slow render updates
    await sleep(1000);

    // subscribe to validator nominators
    let args: any = [];
    for (let i = 0; i < validators.length; i++) {
      args.push([metrics.activeEra.index, validators[i].address]);
    }
    const unsub3 = await api.query.staking.erasStakers.multi(args, (_validators: any) => {
      let stake = [];
      for (let _v of _validators) {
        let v = _v.toHuman();
        let others = v.others ?? [];

        // account for yourself being an additional nominator
        let total_nominations = others.length + 1;

        stake.push({
          total: v.total,
          own: v.own,
          total_nominations: total_nominations,
        });
      }
      // commit update
      let batchesUpdated = Object.assign(validatorMetaBatches);
      batchesUpdated.meta[key].stake = stake;
      setValidatorMetaBatch(batchesUpdated);
    });

    // commit unsubs
    let { unsubs } = validatorMetaBatches;
    unsubs[key] = [unsub, unsub3];

    setValidatorMetaBatch({
      ...validatorMetaBatches,
      unsubs: unsubs,
    });
  }

  /*
   * fetches prefs for a list of validators
   */
  const fetchValidatorPrefs = async (_validators: any) => {

    if (!_validators.length) {
      return false;
    }

    let validators: any = [];
    for (let v of _validators) {
      validators.push(v.address);
    }

    const prefsAll = await api.query.staking.validators.multi(validators);

    let validatorsWithPrefs = [];
    let i = 0;
    for (let _prefs of prefsAll) {
      let prefs = _prefs.toHuman();
      let commission = removePercentage(prefs.commission);

      validatorsWithPrefs.push({
        address: validators[i],
        prefs: {
          commission: commission,
          blocked: prefs.blocked,
        }
      });
      i++;
    }
    return validatorsWithPrefs;
  }

  useEffect(() => {
    subscribeToStakingkMetrics(api);

    return (() => {
      // unsubscribe from staking metrics
      if (stakingMetrics.unsub !== null) {
        stakingMetrics.unsub();
      }
      // unsubscribe from any validator meta batches
      Object.values(validatorMetaBatches.unsubs).map((item: any, index: number) => {
        for (let unsub of item) {
          unsub();
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
        fetchValidatorPrefs: fetchValidatorPrefs,
        staking: stakingMetrics,
        session: sessionValidators.session,
        meta: validatorMetaBatches.meta,
      }}>
      {props.children}
    </StakingMetricsContext.Provider>
  );
}