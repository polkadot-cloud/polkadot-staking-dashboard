// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { sleep, removePercentage, rmCommas, setStateWithRef } from 'Utils';
import { APIContextInterface } from 'types/api';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { useNetworkMetrics } from '../Network';
import { useBalances } from '../Balances';
import * as defaults from './defaults';
import { usePools } from '../Pools';

// context type
export interface ValidatorsContextState {
  fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => void;
  removeValidatorMetaBatch: (k: string) => void;
  fetchValidatorPrefs: (v: any) => any;
  addFavourite: (a: string) => any;
  removeFavourite: (a: string) => any;
  getMinRewardBond: (v: any) => any;
  validators: any;
  meta: any;
  session: any;
  favourites: any;
  nominated: any;
  poolNominated: any;
  favouritesList: any;
}

// context definition
export const ValidatorsContext: React.Context<ValidatorsContextState> =
  React.createContext({
    fetchValidatorMetaBatch: (k: string, v: [], r?: boolean) => {},
    removeValidatorMetaBatch: (k: string) => {},
    fetchValidatorPrefs: (v: any) => {},
    addFavourite: (a: string) => {},
    removeFavourite: (a: string) => {},
    getMinRewardBond: (v: any) => {},
    validators: [],
    meta: {},
    session: [],
    favourites: [],
    nominated: [],
    poolNominated: [],
    favouritesList: [],
  });

export const useValidators = () => React.useContext(ValidatorsContext);

// wrapper component to provide components with context
export const ValidatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api, network, consts } = useApi() as APIContextInterface;
  const { activeAccount }: any = useConnect();
  const { metrics }: any = useNetworkMetrics();
  const { accounts, getAccountNominations }: any = useBalances();
  const { poolNominations } = usePools();

  const { maxNominatorRewardedPerValidator } = consts;

  // stores the total validator entries
  const [validators, setValidators]: any = useState([]);

  // track whether the validator list has been fetched yet
  const [fetchedValidators, setFetchedValidators] = useState(false);

  // stores the currently active validator set
  const [sessionValidators, setSessionValidators] = useState(
    defaults.sessionValidators
  );

  // stores the meta data batches for validator lists
  const [validatorMetaBatches, setValidatorMetaBatch]: any = useState({});
  const validatorMetaBatchesRef = useRef(validatorMetaBatches);

  // stores the meta batch subscriptions for validator lists
  const [validatorSubs, setValidatorSubs]: any = useState({});
  const validatorSubsRef = useRef(validatorSubs);

  // get favourites from local storage
  const getFavourites = () => {
    const _favourites: any = localStorage.getItem(
      `${network.name.toLowerCase()}_favourites`
    );
    return _favourites !== null ? JSON.parse(_favourites) : [];
  };

  // stores the user's favourite validators
  const [favourites, setFavourites]: any = useState(getFavourites());

  // stores the user's nominated validators as list
  const [nominated, setNominated]: any = useState(null);

  // stores the nominated validators by the members pool's as list
  const [poolNominated, setPoolNominated]: any = useState(null);

  // stores the user's favourites validators as list
  const [favouritesList, setFavouritesList]: any = useState(null);

  // reset validators list on network change
  useEffect(() => {
    setFetchedValidators(false);
    setSessionValidators(defaults.sessionValidators);
    removeValidatorMetaBatch('validators_browse');
    setValidators([]);
  }, [network]);

  useEffect(() => {
    if (isReady) {
      fetchValidators();
      subscribeSessionValidators(api);
    }

    return () => {
      // unsubscribe from any validator meta batches
      Object.values(validatorSubsRef.current).map(
        (batch: any, index: number) => {
          return Object.entries(batch).map(([k, v]: any) => {
            return v();
          });
        }
      );
    };
  }, [isReady, metrics.activeEra]);

  // pre-populating validator meta batches. Needed for generating nominations
  useEffect(() => {
    if (validators.length > 0) {
      fetchValidatorMetaBatch('validators_browse', validators, true);
    }
  }, [isReady, validators]);

  // fetch active account's nominations in validator list format
  useEffect(() => {
    if (isReady && activeAccount !== '') {
      fetchNominatedList();
    }
  }, [isReady, activeAccount, accounts]);

  const fetchNominatedList = async () => {
    // get raw nominations list
    let n = getAccountNominations(activeAccount);
    // format to list format
    n = n.map((item: any, index: any) => {
      return { address: item };
    });
    // fetch preferences

    const nominationsWithPrefs = await fetchValidatorPrefs(n);

    if (nominationsWithPrefs) {
      setNominated(nominationsWithPrefs);
    } else {
      setNominated([]);
    }
  };

  // fetch active account's pool nominations in validator list format
  useEffect(() => {
    if (isReady && poolNominations) {
      fetchPoolNominatedList();
    }
  }, [isReady, poolNominations]);

  const fetchPoolNominatedList = async () => {
    // get raw nominations list
    let n = poolNominations.targets;
    // format to list format
    n = n.map((item: any, index: any) => {
      return { address: item };
    });
    // fetch preferences
    const nominationsWithPrefs = await fetchValidatorPrefs(n);
    if (nominationsWithPrefs) {
      setPoolNominated(nominationsWithPrefs);
    } else {
      setPoolNominated([]);
    }
  };

  // re-fetch favourites upon network change
  useEffect(() => {
    setFavourites(getFavourites());
  }, [network]);

  // fetch favourites in validator list format
  useEffect(() => {
    if (isReady) {
      fetchFavouriteList();
    }
  }, [isReady, favourites]);

  const fetchFavouriteList = async () => {
    // format to list format
    const _favourites = [...favourites].map((item: any, index: any) => {
      return { address: item };
    });
    // // fetch preferences
    const favouritesWithPrefs = await fetchValidatorPrefs(_favourites);
    if (favouritesWithPrefs) {
      setFavouritesList(favouritesWithPrefs);
    } else {
      setFavouritesList([]);
    }
  };

  /*
   * Fetches the active validator set.
   * Validator meta batches are derived from this initial list.
   */
  const fetchValidators = async () => {
    if (!isReady || !api) {
      return;
    }
    if (fetchedValidators) {
      return;
    }

    // fetch validator set
    const v: any = [];
    const exposures = await api.query.staking.validators.entries();
    exposures.forEach(([_args, _prefs]: any) => {
      const address = _args.args[0].toHuman();
      const prefs = _prefs.toHuman();

      const _commission = removePercentage(prefs.commission);

      v.push({
        address,
        prefs: {
          commission: parseFloat(_commission.toFixed(2)),
          blocked: prefs.blocked,
        },
      });
    });

    setFetchedValidators(true);
    setValidators(v);
  };

  /*
   * subscribe to active session
   */
  const subscribeSessionValidators = async (_api: any) => {
    if (isReady) {
      const unsub = await _api.query.session.validators((_validators: any) => {
        setSessionValidators({
          ...sessionValidators,
          list: _validators.toHuman(),
        });
      });
      setSessionValidators({
        ...sessionValidators,
        unsub,
      });
    }
  };

  /*
   * fetches prefs for a list of validators
   */
  const fetchValidatorPrefs = async (_validators: any) => {
    if (!_validators.length || !api) {
      return false;
    }

    const v: any = [];
    for (const _v of _validators) {
      v.push(_v.address);
    }

    const prefsAll = await api.query.staking.validators.multi(v);

    const validatorsWithPrefs = [];
    let i = 0;
    for (const _prefs of prefsAll) {
      const prefs: any = _prefs.toHuman();
      const commission = removePercentage(prefs.commission);

      validatorsWithPrefs.push({
        address: v[i],
        prefs: {
          commission,
          blocked: prefs.blocked,
        },
      });
      i++;
    }
    return validatorsWithPrefs;
  };

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
  const fetchValidatorMetaBatch = async (
    key: string,
    v: any,
    refetch = false
  ) => {
    if (!isReady || !api) {
      return;
    }

    if (!v.length) {
      return;
    }

    if (!refetch) {
      // if already exists, do not re-fetch
      if (validatorMetaBatchesRef.current[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      delete validatorMetaBatches[key];
      delete validatorMetaBatchesRef.current[key];

      if (validatorSubsRef.current[key] !== undefined) {
        for (const unsub of validatorSubsRef.current[key]) {
          unsub();
        }
      }
    }

    const addresses = [];
    for (const _v of v) {
      addresses.push(_v.address);
    }

    // store batch addresses
    const batchesUpdated = Object.assign(validatorMetaBatchesRef.current);
    batchesUpdated[key] = {};
    batchesUpdated[key].addresses = addresses;
    setStateWithRef(
      batchesUpdated,
      setValidatorMetaBatch,
      validatorMetaBatchesRef
    );

    const subscribeToIdentities = async (addr: any) => {
      const unsub = await api.query.identity.identityOf.multi(
        addr,
        (_identities: any) => {
          const identities = [];
          for (let i = 0; i < _identities.length; i++) {
            identities.push(_identities[i].toHuman());
          }
          const _batchesUpdated = Object.assign(
            validatorMetaBatchesRef.current
          );
          _batchesUpdated[key].identities = identities;
          setStateWithRef(
            _batchesUpdated,
            setValidatorMetaBatch,
            validatorMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    const subscribeToSuperIdentities = async (addr: any) => {
      const unsub = await api.query.identity.superOf.multi(
        addr,
        async (_supers: any) => {
          // determine where supers exist
          const supers: any = [];
          const supersWithIdentity: any = [];

          for (let i = 0; i < _supers.length; i++) {
            const _super = _supers[i].toHuman();
            supers.push(_super);
            if (_super !== null) {
              supersWithIdentity.push(i);
            }
          }

          // get supers one-off multi query
          const query = supers
            .filter((s: any) => s !== null)
            .map((s: any) => s[0]);

          const temp = await api.query.identity.identityOf.multi(
            query,
            (_identities: any) => {
              for (let j = 0; j < _identities.length; j++) {
                const _identity = _identities[j].toHuman();
                // inject identity into super array
                supers[supersWithIdentity[j]].identity = _identity;
              }
            }
          );
          temp();

          const _batchesUpdated = Object.assign(
            validatorMetaBatchesRef.current
          );
          _batchesUpdated[key].supers = supers;
          setStateWithRef(
            _batchesUpdated,
            setValidatorMetaBatch,
            validatorMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    await Promise.all([
      subscribeToIdentities(addresses),
      subscribeToSuperIdentities(addresses),
    ]).then((unsubs: any) => {
      addMetaBatchUnsubs(key, unsubs);
    });

    // intentional throttle to prevent slow render updates.
    await sleep(250);

    // subscribe to validator nominators
    const args: any = [];

    for (let i = 0; i < v.length; i++) {
      args.push([metrics.activeEra.index, v[i].address]);
    }

    const unsub3 = await api.query.staking.erasStakers.multi(
      args,
      (_validators: any) => {
        const stake = [];

        for (let _validator of _validators) {
          _validator = _validator.toHuman();
          let others = _validator.others ?? [];

          // account for yourself being an additional nominator
          const totalNominations = others.length + 1;

          // get lowest active stake for the validator
          others = others.sort((a: any, b: any) => {
            const x = new BN(rmCommas(a.value));
            const y = new BN(rmCommas(b.value));
            return x.sub(y);
          });

          const lowestActive =
            others.length > 0
              ? new BN(rmCommas(others[0].value))
                  .div(new BN(10 ** network.units))
                  .toNumber()
              : 0;

          // get the lowest reward stake of the validator, which is
          // the largest index - `maxNominatorRewardedPerValidator`,
          // or the first index if does not exist.
          const lowestRewardIndex = Math.max(
            others.length - maxNominatorRewardedPerValidator,
            0
          );

          const lowestReward =
            others.length > 0
              ? new BN(rmCommas(others[lowestRewardIndex]?.value))
                  .div(new BN(10 ** network.units))
                  .toNumber()
              : 0;

          stake.push({
            total: _validator.total,
            own: _validator.own,
            total_nominations: totalNominations,
            lowest: lowestActive,
            lowestReward,
          });
        }

        // commit update
        const _batchesUpdated = Object.assign(validatorMetaBatchesRef.current);
        _batchesUpdated[key].stake = stake;

        setStateWithRef(
          _batchesUpdated,
          setValidatorMetaBatch,
          validatorMetaBatchesRef
        );
      }
    );

    addMetaBatchUnsubs(key, [unsub3]);
  };

  /*
   * Helper function to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: any) => {
    const _unsubs = validatorSubsRef.current;
    const _keyUnsubs = _unsubs[key] ?? [];

    _keyUnsubs.push(...unsubs);
    _unsubs[key] = _keyUnsubs;
    setStateWithRef(_unsubs, setValidatorSubs, validatorSubsRef);
  };

  const removeValidatorMetaBatch = (key: string) => {
    if (validatorSubsRef.current[key] !== undefined) {
      // ubsubscribe from updates
      for (const unsub of validatorSubsRef.current[key]) {
        unsub();
      }
      // wipe data
      delete validatorMetaBatches[key];
      delete validatorMetaBatchesRef.current[key];
    }
  };

  /*
   * Adds a favourite validator.
   */
  const addFavourite = (address: string) => {
    const _favourites: any = Object.assign(favourites);
    if (!_favourites.includes(address)) {
      _favourites.push(address);
    }

    localStorage.setItem(
      `${network.name.toLowerCase()}_favourites`,
      JSON.stringify(_favourites)
    );
    setFavourites([..._favourites]);
  };

  /*
   * Removes a favourite validator if they exist.
   */
  const removeFavourite = (address: string) => {
    let _favourites = Object.assign(favourites);
    _favourites = _favourites.filter((validator: any) => validator !== address);
    localStorage.setItem(
      `${network.name.toLowerCase()}_favourites`,
      JSON.stringify(_favourites)
    );
    setFavourites([..._favourites]);
  };

  /*
   * Gets the minimum bond of a group of validators needed for rewards.
   */
  const getMinRewardBond = (_addresses: any) => {
    const batch = validatorMetaBatchesRef.current.validators_browse;

    let lowest = null;
    for (const a of _addresses) {
      const batchIndex = batch.addresses.indexOf(a);
      const stake = batch.stake[batchIndex];

      if (lowest === null) {
        lowest = stake.lowest;
      } else if (stake.lowest < lowest) {
        lowest = stake.lowest;
      }
    }
    return lowest;
  };

  return (
    <ValidatorsContext.Provider
      value={{
        fetchValidatorMetaBatch,
        removeValidatorMetaBatch,
        fetchValidatorPrefs,
        addFavourite,
        removeFavourite,
        getMinRewardBond,
        validators,
        meta: validatorMetaBatchesRef.current,
        session: sessionValidators,
        favourites,
        nominated,
        poolNominated,
        favouritesList,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  );
};
