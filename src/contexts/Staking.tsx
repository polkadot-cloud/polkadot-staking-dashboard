// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef, } from 'react';
import { useApi } from './Api';
import { useNetworkMetrics } from './Network';
import BN from "bn.js";
import { sleep, removePercentage } from '../Utils';
import { useBalances } from './Balances';
import { useConnect } from './Connect';

// validators per batch in multi-batch fetching
const VALIDATORS_PER_BATCH_MUTLI = 20;
const THROTTLE_VALIDATOR_RENDER = 250;

// context type
export interface StakingContextState {
  VALIDATORS_PER_BATCH_MUTLI: number,
  THROTTLE_VALIDATOR_RENDER: number,
  fetchValidatorMetaBatch: (k: string, v: []) => void;
  getValidatorMetaBatch: (k: string) => any;
  removeValidatorMetaBatch: (k: string) => void;
  fetchValidatorPrefs: (v: any) => any;
  removeIndexFromBatch: (k: string, i: number) => void;
  addFavourite: (a: string) => any;
  removeFavourite: (a: string) => any;
  hasController: () => any;
  isBonding: () => any;
  isNominating: () => any;
  inSetup: () => any;
  staking: any;
  validators: any;
  eraStakers: any;
  favourites: any;
  meta: any;
  session: any;
}

// context definition
export const StakingContext: React.Context<StakingContextState> = React.createContext({
  VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
  THROTTLE_VALIDATOR_RENDER: THROTTLE_VALIDATOR_RENDER,
  fetchValidatorMetaBatch: (k: string, v: []) => { },
  getValidatorMetaBatch: (k: string) => { },
  removeValidatorMetaBatch: (k: string) => { },
  fetchValidatorPrefs: (v: any) => { },
  removeIndexFromBatch: (k: string, i: number) => { },
  addFavourite: (a: string) => { },
  removeFavourite: (a: string) => { },
  hasController: () => false,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => false,
  staking: {},
  validators: [],
  eraStakers: {},
  favourites: [],
  meta: {},
  session: {},
});

// useStaking
export const useStaking = () => React.useContext(StakingContext);

// wrapper component to provide components with context
export const StakingContextWrapper = (props: any) => {

  const { activeAccount } = useConnect();
  const { isReady, api, consts }: any = useApi();
  const { maxNominatorRewardedPerValidator } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { getBondedAccount, getAccountLedger, getAccountNominations }: any = useBalances();

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

  let _favourites: any = localStorage.getItem('favourites');
  _favourites = _favourites === null
    ? []
    : JSON.parse(_favourites);

  const [validators, setValidators]: any = useState([]);
  const [favourites, setFavourites]: any = useState(_favourites);
  const [sessionValidators, setSessionValidators] = useState({
    list: [],
    unsub: null,
  });

  const [validatorMetaBatches, _setValidatorMetaBatch]: any = useState({
    meta: {},
    unsubs: {},
  });

  const [eraStakers, setEraStakers]: any = useState({
    activeNominators: 0,
    activeValidators: 0,
  })

  const validatorMetaBatchesRef = useRef(validatorMetaBatches);

  const setValidatorMetaBatch = (val: any) => {
    validatorMetaBatchesRef.current = val;
    _setValidatorMetaBatch(val);
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
      ], ([_totalNominators, _totalValidators, _maxNominatorsCount, _maxValidatorsCount, _validatorCount, _lastReward, _lastTotalStake, _minNominatorBond, _historyDepth]: any) => {

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
        });
      });

      setStakingMetrics({
        ...stakingMetrics,
        unsub: unsub,
      });
    }
  }

  /* 
   * Fetches the active validator set.
   * Validator meta batches are derived from this initial list.
   */
  const fetchValidators = async () => {
    if (!isReady) { return }

    // fetch validator set
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
    setValidators(validators);
  }

  /* 
   * Fetches the active nominator count.
   * The top 256 nominators of each validator get rewarded.
   * This function uses the above assumption to calculate active nominator count.
   */
  const fetchEraStakers = async () => {
    if (!isReady || metrics.activeEra.index === 0) { return }

    const exposures = await api.query.staking.erasStakers.entries(metrics.activeEra.index);

    // calculate total active nominators
    let _activeNominators = 0;
    let _activeValidators = 0;
    exposures.forEach(([_keys, _val]: any) => {
      _activeValidators++;
      let _nominators = _val.toHuman()?.others?.length ?? 0;
      if (_nominators > maxNominatorRewardedPerValidator) {
        _activeNominators += maxNominatorRewardedPerValidator;
      } else {
        _activeNominators += _nominators;
      }

      setEraStakers({
        ...eraStakers,
        activeNominators: _activeNominators,
        activeValidators: _activeValidators,
      })
    });
  }

  /*
   * subscribe to active session
  */
  const subscribeSessionValidators = async (api: any) => {

    if (isReady) {
      const unsub = await api.query.session.validators((_validators: any) => {
        setSessionValidators({
          ...sessionValidators,
          list: _validators.toHuman()
        });
      });
      setSessionValidators({
        ...sessionValidators,
        unsub: unsub
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
          identities: [],
        }
      ]
    },
  };
  */
  const fetchValidatorMetaBatch = async (key: string, validators: any, refetch: boolean = false) => {
    if (!isReady) { return }

    if (!validators.length) { return; }

    if (!refetch) {
      // if already exists, do not re-fetch
      if (validatorMetaBatches.meta[key] !== undefined) {
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
    setValidatorMetaBatch({ ...batchesUpdated });

    const subscribeToIdentities = async (addresses: any) => {

      const unsub = await api.query.identity.identityOf.multi(addresses, (_identities: any) => {
        let identities = [];
        for (let i = 0; i < _identities.length; i++) {
          identities.push(_identities[i].toHuman());
        }
        let batchesUpdated = Object.assign(validatorMetaBatches);
        batchesUpdated.meta[key].identities = identities;
        setValidatorMetaBatch({ ...batchesUpdated });
      });
      return unsub;
    }

    const subscribeToSuperIdentities = async (addresses: any) => {
      const unsub = await api.query.identity.superOf.multi(addresses, async (_supers: any) => {

        // determine where supers exist
        let supers: any = [];
        let supersWithIdentity: any = [];

        for (let i = 0; i < _supers.length; i++) {
          let _super = _supers[i].toHuman();
          supers.push(_super);
          if (_super !== null) {
            supersWithIdentity.push(i);
          }
        }

        // get supers one-off multi query
        let query = supers.filter((s: any) => s !== null).map((s: any) => s[0]);

        let temp = await api.query.identity.identityOf.multi(query, (_identities: any) => {
          for (let j = 0; j < _identities.length; j++) {
            let _identity = _identities[j].toHuman();
            // inject identity into super array
            supers[supersWithIdentity[j]].identity = _identity;
          }
        });
        temp();

        let batchesUpdated = Object.assign(validatorMetaBatches);
        batchesUpdated.meta[key].supers = supers;
        setValidatorMetaBatch({ ...batchesUpdated });
      });
      return unsub;
    }

    await Promise.all(
      [subscribeToIdentities(addresses),
      subscribeToSuperIdentities(addresses)]).then((unsubs: any) => {
        addMetaBatchUnsubs(key, unsubs);
      });


    // intentional throttle to prevent slow render updates.
    await sleep(750);

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
      setValidatorMetaBatch({ ...batchesUpdated });
    });

    addMetaBatchUnsubs(key, [unsub3]);
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
    fetchValidators();
    fetchEraStakers();
    subscribeToStakingkMetrics(api);
    subscribeSessionValidators(api);

    return (() => {
      // unsubscribe from staking metrics
      if (stakingMetrics.unsub !== null) {
        stakingMetrics.unsub();
      }
      // unsubscribe from any validator meta batches
      Object.values(validatorMetaBatches.unsubs).map((batch: any, index: number) => {
        return Object.entries(batch).map(([k, v]: any) => {
          return v();
        });
      });
    })
  }, [isReady, metrics.activeEra]);

  useEffect(() => {
    if (validators.length > 0) {
      // pre-populating validator meta batches
      fetchValidatorMetaBatch('validators_browse', validators);
    }
  }, [isReady, validators]);

  const removeValidatorMetaBatch = (key: string) => {

    if (validatorMetaBatches.meta[key] !== undefined) {
      // ubsubscribe from updates
      for (let unsub of validatorMetaBatches.unsubs[key]) {
        unsub();
      }
      // wipe data
      delete validatorMetaBatches.meta[key];
    }
  }

  const getValidatorMetaBatch = (key: string) => {
    if (validatorMetaBatches.meta[key] === undefined) {
      return null;
    }
    return validatorMetaBatches.meta[key];
  }

  const removeIndexFromBatch = (key: string, index: number) => {

    let batchesUpdated = Object.assign(validatorMetaBatches, {});
    batchesUpdated.meta[key].addresses.splice(index, 1);

    if (batchesUpdated.meta[key].stake !== undefined) {
      batchesUpdated.meta[key].identities.splice(index, 1);
    }

    if (batchesUpdated.meta[key].stake !== undefined) {
      batchesUpdated.meta[key].stake.splice(index, 1);
    }

    setValidatorMetaBatch({ ...batchesUpdated });
  }

  /*
   * Adds a favourite validator.
   */
  const addFavourite = (address: string) => {
    let _favourites: any = Object.assign(favourites);
    if (!_favourites.includes(address)) {
      _favourites.push(address);
    }
    localStorage.setItem('favourites', JSON.stringify(_favourites));
    setFavourites([..._favourites]);
  }

  /*
   * Removes a favourite validator if they exist.
   */
  const removeFavourite = (address: string) => {
    let _favourites = Object.assign(favourites);
    _favourites = _favourites.filter((validator: any) => validator !== address);
    localStorage.setItem('favourites', JSON.stringify(_favourites));
    setFavourites([..._favourites]);
  }

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


  /*
   * Helper function to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: any) => {

    let _unsubs = validatorMetaBatches.unsubs;
    let _keyUnsubs = _unsubs[key] ?? [];

    _keyUnsubs.push(...unsubs)
    _unsubs[key] = _keyUnsubs;

    setValidatorMetaBatch({
      ...validatorMetaBatches,
      unsubs: _unsubs,
    });
  }

  return (
    <StakingContext.Provider
      value={{
        VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
        THROTTLE_VALIDATOR_RENDER: THROTTLE_VALIDATOR_RENDER,
        fetchValidatorMetaBatch: fetchValidatorMetaBatch,
        getValidatorMetaBatch: getValidatorMetaBatch,
        removeValidatorMetaBatch: removeValidatorMetaBatch,
        fetchValidatorPrefs: fetchValidatorPrefs,
        removeIndexFromBatch: removeIndexFromBatch,
        addFavourite: addFavourite,
        removeFavourite: removeFavourite,
        hasController: hasController,
        isBonding: isBonding,
        isNominating: isNominating,
        inSetup: inSetup,
        staking: stakingMetrics,
        validators: validators,
        eraStakers: eraStakers,
        favourites: favourites,
        meta: validatorMetaBatchesRef.current.meta,
        session: sessionValidators,
      }}>
      {props.children}
    </StakingContext.Provider>
  );
}