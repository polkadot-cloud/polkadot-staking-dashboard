// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import BN from "bn.js";
import { useApi } from './Api';
import { useConnect } from './Connect';
import { useNetworkMetrics } from './Network';
import { useBalances } from './Balances';
import { sleep, removePercentage, rmCommas } from '../Utils';

// validators per batch in multi-batch fetching
const VALIDATORS_PER_BATCH_MUTLI = 20;

// context type
export interface ValidatorsContextState {
  VALIDATORS_PER_BATCH_MUTLI: number;
  fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => void;
  getValidatorMetaBatch: (k: string) => any;
  removeValidatorMetaBatch: (k: string) => void;
  fetchValidatorPrefs: (v: any) => any;
  removeIndexFromBatch: (k: string, i: number) => void;
  addFavourite: (a: string) => any;
  removeFavourite: (a: string) => any;
  validators: any;
  meta: any;
  session: any;
  favourites: any;
  nominated: any;
}

// context definition
export const ValidatorsContext: React.Context<ValidatorsContextState> = React.createContext({
  VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
  fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => { },
  getValidatorMetaBatch: (k: string) => { },
  removeValidatorMetaBatch: (k: string) => { },
  fetchValidatorPrefs: (v: any) => { },
  removeIndexFromBatch: (k: string, i: number) => { },
  addFavourite: (a: string) => { },
  removeFavourite: (a: string) => { },
  validators: [],
  meta: {},
  session: [],
  favourites: [],
  nominated: [],
});

export const useValidators = () => React.useContext(ValidatorsContext);

// wrapper component to provide components with context
export const ValidatorsContextWrapper = (props: any) => {

  const { isReady, api }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { metrics }: any = useNetworkMetrics();
  const { getAccountNominations }: any = useBalances();

  // stores the total validator entries
  const [validators, setValidators]: any = useState([]);

  // track whether the validator list has been fetched yet
  const [fetchedValidators, setFetchedValidators] = useState(false);

  // stores the currently active validator set
  const [sessionValidators, setSessionValidators] = useState({
    list: [],
    unsub: null,
  });

  // stores the meta data batches for validator lists
  const [validatorMetaBatches, _setValidatorMetaBatch]: any = useState({
    meta: {},
    unsubs: {},
  });

  // uses ref for subscriptions to have access to real meta batches
  const validatorMetaBatchesRef = useRef(validatorMetaBatches);
  const setValidatorMetaBatch = (val: any) => {
    validatorMetaBatchesRef.current = val;
    _setValidatorMetaBatch(val);
  }

  // collect favourites from local storage if they exist
  let _favourites: any = localStorage.getItem('favourites');
  _favourites = _favourites !== null
    ? JSON.parse(_favourites)
    : [];

  // stores the user's favourite validators
  const [favourites, setFavourites]: any = useState(_favourites);

  // stores the user's nominated validators
  const [nominated, setNominated]: any = useState(null);

  useEffect(() => {
    if (isReady) {
      fetchValidators();
      subscribeSessionValidators(api);
    }

    return (() => {
      // unsubscribe from any validator meta batches
      Object.values(validatorMetaBatchesRef.current.unsubs).map((batch: any, index: number) => {
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

  // fetch active account's nominations in validator list format
  useEffect(() => {
    fetchNominatedList();
  }, [activeAccount, getAccountNominations(activeAccount)]);

  const fetchNominatedList = async () => {

    // get raw nominations list
    let nominated = getAccountNominations(activeAccount);

    // format to list format
    nominated = nominated.map((item: any, index: any) => { return ({ address: item }) });

    // fetch preferences
    const nominationsWithPrefs = await fetchValidatorPrefs(nominated);

    if (nominationsWithPrefs) {
      setNominated(nominationsWithPrefs);
    } else {
      setNominated([]);
    }
  }

  /* 
   * Fetches the active validator set.
   * Validator meta batches are derived from this initial list.
   */
  const fetchValidators = async () => {
    if (!isReady) { return }
    if (fetchedValidators) { return }

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

    setFetchedValidators(true);
    setValidators(validators);
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
      if (validatorMetaBatchesRef.current.meta[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      delete validatorMetaBatches[key];
      delete validatorMetaBatchesRef.current[key];

      if (validatorMetaBatchesRef.current.unsubs[key] !== undefined) {
        for (let unsub of validatorMetaBatchesRef.current.unsubs[key]) {
          unsub();
        }
      }
    }

    let addresses = [];
    for (let v of validators) {
      addresses.push(v.address);
    }

    // store batch addresses
    let batchesUpdated = Object.assign(validatorMetaBatchesRef.current);
    batchesUpdated.meta[key] = {};
    batchesUpdated.meta[key].addresses = addresses;
    setValidatorMetaBatch({ ...batchesUpdated });

    const subscribeToIdentities = async (addresses: any) => {

      const unsub = await api.query.identity.identityOf.multi(addresses, (_identities: any) => {
        let identities = [];
        for (let i = 0; i < _identities.length; i++) {
          identities.push(_identities[i].toHuman());
        }
        let batchesUpdated = Object.assign(validatorMetaBatchesRef.current);
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

        let batchesUpdated = Object.assign(validatorMetaBatchesRef.current);
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

        // get lowest stake for the validator
        others = others.sort((a: any, b: any) => {
          let x = new BN(rmCommas(a.value));
          let y = new BN(rmCommas(b.value));
          return x.sub(y);
        });

        let lowest = others.length > 0
          ? new BN(rmCommas(others[0].value)).div(new BN(10 ** 10)).toNumber()
          : 0;

        stake.push({
          total: v.total,
          own: v.own,
          total_nominations: total_nominations,
          lowest: lowest,
        });
      }

      // commit update
      let batchesUpdated = Object.assign(validatorMetaBatchesRef.current);
      batchesUpdated.meta[key].stake = stake;
      setValidatorMetaBatch({ ...batchesUpdated });
    });

    addMetaBatchUnsubs(key, [unsub3]);
  }

  /*
   * Helper function to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: any) => {

    let _unsubs = validatorMetaBatchesRef.current.unsubs;
    let _keyUnsubs = _unsubs[key] ?? [];

    _keyUnsubs.push(...unsubs)
    _unsubs[key] = _keyUnsubs;

    setValidatorMetaBatch({
      ...validatorMetaBatchesRef.current,
      unsubs: _unsubs,
    });
  }

  const removeValidatorMetaBatch = (key: string) => {

    if (validatorMetaBatchesRef.current.meta[key] !== undefined) {
      // ubsubscribe from updates
      for (let unsub of validatorMetaBatchesRef.current.unsubs[key]) {
        unsub();
      }
      // wipe data
      delete validatorMetaBatches.meta[key];
      delete validatorMetaBatchesRef.current[key];
    }
  }

  const getValidatorMetaBatch = (key: string) => {
    if (validatorMetaBatchesRef.current.meta[key] === undefined) {
      return null;
    }
    return validatorMetaBatchesRef.current.meta[key];
  }

  const removeIndexFromBatch = (key: string, index: number) => {

    let batchesUpdated = Object.assign(validatorMetaBatchesRef.current, {});
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

  return (
    <ValidatorsContext.Provider value={{
      VALIDATORS_PER_BATCH_MUTLI: VALIDATORS_PER_BATCH_MUTLI,
      fetchValidatorMetaBatch: fetchValidatorMetaBatch,
      getValidatorMetaBatch: getValidatorMetaBatch,
      removeValidatorMetaBatch: removeValidatorMetaBatch,
      fetchValidatorPrefs: fetchValidatorPrefs,
      removeIndexFromBatch: removeIndexFromBatch,
      addFavourite: addFavourite,
      removeFavourite: removeFavourite,
      validators: validators,
      meta: validatorMetaBatchesRef.current.meta,
      session: sessionValidators,
      favourites: favourites,
      nominated: nominated,
    }}>
      {props.children}
    </ValidatorsContext.Provider>
  );
}