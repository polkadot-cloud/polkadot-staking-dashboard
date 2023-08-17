// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  greaterThanZero,
  planckToUnit,
  rmCommas,
  setStateWithRef,
  shuffle,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { ValidatorCommunity } from '@polkadot-cloud/community/validators';
import type {
  Validator,
  ValidatorAddresses,
  ValidatorsContextInterface,
} from 'contexts/Validators/types';
import type { AnyApi, AnyMetaBatch, Fn, Sync } from 'types';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { useApi } from '../Api';
import { useBonded } from '../Bonded';
import { useConnect } from '../Connect';
import { useNetworkMetrics } from '../Network';
import { useActivePools } from '../Pools/ActivePools';
import { defaultExposureData, defaultValidatorsContext } from './defaults';
import {
  getEraLocalExposures,
  getLocalFavorites,
  setEraLocalExposures,
} from './Utils';

export const ValidatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { activeAccount } = useConnect();
  const { poolNominations } = useActivePools();
  const { activeEra, metrics } = useNetworkMetrics();
  const { isReady, api, network, consts } = useApi();
  const { bondedAccounts, getAccountNominations } = useBonded();
  const { units, name } = network;
  const { earliestStoredSession } = metrics;
  const { maxNominatorRewardedPerValidator } = consts;

  // Stores the total validator entries.
  const [validators, setValidators] = useState<Validator[]>([]);

  // Track whether the validator list has been fetched.
  const [validatorsFetched, setValidatorsFetched] = useState<Sync>('unsynced');

  // Stores the currently active validator set.
  const [sessionValidators, setSessionValidators] = useState<string[]>([]);
  const sessionUnsub = useRef<Fn>();

  // Stores the currently active parachain validator set.
  const [sessionParaValidators, setSessionParaValidators] = useState<string[]>(
    []
  );
  const sessionParaUnsub = useRef<Fn>();

  // Stores the average network commission rate.
  const [avgCommission, setAvgCommission] = useState(0);

  // Stores the user's favorite validators.
  const [favorites, setFavorites] = useState<string[]>(getLocalFavorites(name));

  // TODO: refactor.
  // Stores the meta data batches for validator lists.
  const [validatorMetaBatches, setValidatorMetaBatch] = useState<AnyMetaBatch>(
    {}
  );
  const validatorMetaBatchesRef = useRef(validatorMetaBatches);

  // TODO: refactor.
  // stores the meta batch subscriptions for validator lists
  const validatorSubsRef = useRef<Record<string, Fn[]>>({});

  // stores the user's nominated validators as list
  const [nominated, setNominated] = useState<Validator[] | null>(null);

  // stores the nominated validators by the members pool's as list
  const [poolNominated, setPoolNominated] = useState<Validator[] | null>(null);

  // stores the user's favorites validators as list
  const [favoritesList, setFavoritesList] = useState<Validator[] | null>(null);

  // Stores a randomised validator community dataset.
  const [validatorCommunity] = useState<any>([...shuffle(ValidatorCommunity)]);

  // Reset validators list on network change.
  useEffectIgnoreInitial(() => {
    setValidatorsFetched('unsynced');
    setSessionValidators([]);
    setSessionParaValidators([]);
    removeValidatorMetaBatch('validators_browse');
    setAvgCommission(0);
    setValidators([]);
  }, [network]);

  // fetch validators and session validators when activeEra ready
  useEffectIgnoreInitial(() => {
    if (isReady && activeEra.index.isGreaterThan(0)) {
      fetchValidators();
      subscribeSessionValidators();
    }

    return () => {
      // unsubscribe from any validator meta batches
      Object.values(validatorSubsRef.current).map((batch: AnyMetaBatch) =>
        Object.entries(batch).map(([, v]: AnyApi) => v())
      );
    };
  }, [isReady, activeEra]);

  // fetch parachain session validators when `earliestStoredSession` ready
  useEffectIgnoreInitial(() => {
    if (isReady && greaterThanZero(earliestStoredSession)) {
      subscribeParachainValidators();
    }
  }, [isReady, earliestStoredSession]);

  // pre-populating validator meta batches. Needed for generating nominations
  useEffectIgnoreInitial(() => {
    if (validators.length > 0) {
      fetchValidatorMetaBatch('validators_browse', validators, true);
    }
  }, [isReady, validators]);

  // fetch active account's nominations in validator list format
  useEffectIgnoreInitial(() => {
    if (isReady && activeAccount) {
      fetchNominatedList();
    }
  }, [isReady, activeAccount, bondedAccounts]);

  const fetchNominatedList = async () => {
    if (!activeAccount) return;

    // get raw targets list
    const targets = getAccountNominations(activeAccount);

    // format to list format
    const targetsFormatted = targets.map((item: any) => ({ address: item }));
    // fetch preferences
    const nominationsWithPrefs = await fetchValidatorPrefs(targetsFormatted);
    setNominated(nominationsWithPrefs || []);
  };

  // fetch active account's pool nominations in validator list format
  useEffectIgnoreInitial(() => {
    if (isReady && poolNominations) {
      fetchPoolNominatedList();
    }
  }, [isReady, poolNominations]);

  // Unsubscribe on network change and component unmount.
  useEffect(() => {
    if (sessionValidators.length) {
      sessionUnsub.current?.();
    }
    if (sessionParaValidators.length) {
      sessionParaUnsub.current?.();
    }
    return () => {
      sessionUnsub.current?.();
      sessionParaUnsub.current?.();
    };
  }, [network]);

  const fetchPoolNominatedList = async () => {
    // get raw nominations list
    let n = poolNominations.targets;
    // format to list format
    n = n.map((item: string) => ({ address: item }));
    // fetch preferences
    const nominationsWithPrefs = await fetchValidatorPrefs(n);
    setPoolNominated(nominationsWithPrefs || []);
  };

  // re-fetch favorites on network change
  useEffectIgnoreInitial(() => {
    setFavorites(getLocalFavorites(name));
  }, [network]);

  // fetch favorites in validator list format
  useEffectIgnoreInitial(() => {
    if (isReady) {
      fetchFavoriteList();
    }
  }, [isReady, favorites]);

  const fetchFavoriteList = async () => {
    // fetch preferences
    const favoritesWithPrefs = await fetchValidatorPrefs(
      [...favorites].map((address) => ({
        address,
      }))
    );
    setFavoritesList(favoritesWithPrefs || []);
  };

  // Fetch validator entries and format the returning data.
  const getDataFromExposures = async () => {
    if (!isReady || !api) return defaultExposureData;

    const entries = await api.query.staking.validators.entries();

    const exposures: Validator[] = [];
    let notFullCommissionCount = 0;
    let totalNonAllCommission = new BigNumber(0);
    entries.forEach(([a, p]: AnyApi) => {
      const address = a.toHuman().pop();
      const prefs = p.toHuman();
      const commission = new BigNumber(prefs.commission.replace(/%/g, ''));

      if (!commission.isEqualTo(100)) {
        totalNonAllCommission = totalNonAllCommission.plus(commission);
      } else {
        notFullCommissionCount++;
      }

      exposures.push({
        address,
        prefs: {
          commission: Number(commission.toFixed(2)),
          blocked: prefs.blocked,
        },
      });
    });

    return { exposures, notFullCommissionCount, totalNonAllCommission };
  };

  // Fetches and formats the active validator set, and derives metrics from the result.
  const fetchValidators = async () => {
    if (!isReady || !api || validatorsFetched !== 'unsynced') return;
    setValidatorsFetched('syncing');

    // If local exposure data exists for the current active era, store these values in state.
    // Otherwise, fetch exposures from API.
    const localExposures = getEraLocalExposures(
      name,
      activeEra.index.toString()
    );

    // The current exposures for the active era.
    let exposures: Validator[] = [];
    // Average network commission for all non-100% commissioned exposures.
    let avg = 0;

    if (localExposures) {
      exposures = localExposures.exposures;
      avg = localExposures.avgCommission;
    } else {
      const {
        exposures: newExposures,
        notFullCommissionCount,
        totalNonAllCommission,
      } = await getDataFromExposures();

      exposures = newExposures;
      avg = notFullCommissionCount
        ? totalNonAllCommission
            .dividedBy(notFullCommissionCount)
            .decimalPlaces(2)
            .toNumber()
        : 0;
    }

    // Set exposure data for the era to local storage.
    setEraLocalExposures(name, activeEra.index.toString(), exposures, avg);
    setValidatorsFetched('synced');
    setAvgCommission(avg);
    // Validators are shuffled before committed to state.
    setValidators(shuffle(exposures));
  };

  // Subscribe to active session validators.
  const subscribeSessionValidators = async () => {
    if (!api || !isReady) return;
    const unsub: AnyApi = await api.query.session.validators((v: AnyApi) => {
      setSessionValidators(v.toHuman());
      sessionUnsub.current = unsub;
    });
  };

  // Subscribe to active parachain validators.
  const subscribeParachainValidators = async () => {
    if (!api || !isReady) return;
    const unsub: AnyApi = await api.query.paraSessionInfo.accountKeys(
      earliestStoredSession.toString(),
      (v: AnyApi) => {
        setSessionParaValidators(v.toHuman());
        sessionParaUnsub.current = unsub;
      }
    );
  };

  // Fetches prefs for a list of validators.
  const fetchValidatorPrefs = async (addresses: ValidatorAddresses) => {
    if (!addresses.length || !api) return null;

    const v: string[] = [];
    for (const { address } of addresses) v.push(address);
    const results = await api.query.staking.validators.multi(v);

    const formatted: Validator[] = [];
    for (let i = 0; i < results.length; i++) {
      const prefs: AnyApi = results[i].toHuman();
      formatted.push({
        address: v[i],
        prefs: {
          commission: prefs?.commission.replace(/%/g, '') ?? '0',
          blocked: prefs.blocked,
        },
      });
    }
    return formatted;
  };

  /*
    // TODO: refactor
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
    v: AnyMetaBatch,
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
      const updatedValidatorMetaBatches: AnyMetaBatch = {
        ...validatorMetaBatchesRef.current,
      };
      delete updatedValidatorMetaBatches[key];
      setStateWithRef(
        updatedValidatorMetaBatches,
        setValidatorMetaBatch,
        validatorMetaBatchesRef
      );

      if (validatorSubsRef.current[key] !== undefined) {
        for (const unsub of validatorSubsRef.current[key]) {
          unsub();
        }
      }
    }

    const addresses = [];
    for (const address of v) {
      addresses.push(address.address);
    }

    // store batch addresses
    setStateWithRef(
      {
        ...validatorMetaBatchesRef.current,
        [key]: {
          ...validatorMetaBatchesRef.current[key],
          addresses,
        },
      },
      setValidatorMetaBatch,
      validatorMetaBatchesRef
    );

    const subscribeToIdentities = async (addr: string[]) => {
      const unsub = await api.query.identity.identityOf.multi<AnyApi>(
        addr,
        (result) => {
          const identities = [];
          for (let i = 0; i < result.length; i++) {
            identities.push(result[i].toHuman());
          }

          // check if batch still exists before updating
          if (validatorMetaBatchesRef.current[key]) {
            setStateWithRef(
              {
                ...validatorMetaBatchesRef.current,
                [key]: {
                  ...validatorMetaBatchesRef.current[key],
                  identities,
                },
              },
              setValidatorMetaBatch,
              validatorMetaBatchesRef
            );
          }
        }
      );
      return unsub;
    };

    const subscribeToSuperIdentities = async (addr: string[]) => {
      const unsub = await api.query.identity.superOf.multi<AnyApi>(
        addr,
        async (result) => {
          // determine where supers exist
          const supers: AnyApi = [];
          const supersWithIdentity: AnyApi = [];

          for (let i = 0; i < result.length; i++) {
            const resultItem = result[i].toHuman();
            supers.push(resultItem);
            if (resultItem !== null) {
              supersWithIdentity.push(i);
            }
          }

          // get supers one-off multi query
          const query = supers
            .filter((s: AnyApi) => s !== null)
            .map((s: AnyApi) => s[0]);

          const temp = await api.query.identity.identityOf.multi<AnyApi>(
            query,
            (_identities) => {
              for (let j = 0; j < _identities.length; j++) {
                const identity = _identities[j].toHuman();
                // inject identity into super array
                supers[supersWithIdentity[j]].identity = identity;
              }
            }
          );
          temp();

          // check if batch still exists before updating
          if (validatorMetaBatchesRef.current[key]) {
            setStateWithRef(
              {
                ...validatorMetaBatchesRef.current,
                [key]: {
                  ...validatorMetaBatchesRef.current[key],
                  supers,
                },
              },
              setValidatorMetaBatch,
              validatorMetaBatchesRef
            );
          }
        }
      );
      return unsub;
    };

    await Promise.all([
      subscribeToIdentities(addresses),
      subscribeToSuperIdentities(addresses),
    ]).then((unsubs: Fn[]) => {
      addMetaBatchUnsubs(key, unsubs);
    });

    // subscribe to validator nominators
    const args: AnyApi = [];

    for (let i = 0; i < v.length; i++) {
      args.push([activeEra.index.toString(), v[i].address]);
    }

    const unsub3 = await api.query.staking.erasStakers.multi<AnyApi>(
      args,
      (result) => {
        const stake = [];

        for (let validator of result) {
          validator = validator.toHuman();
          let others = validator.others ?? [];

          // account for yourself being an additional nominator.
          const totalNominations = others.length + 1;

          // reformat others.value properties from string to BigNumber.
          others = others.map((other: AnyApi) => ({
            ...other,
            value: new BigNumber(rmCommas(other.value)),
          }));

          // sort others lowest first.
          others = others.sort((a: AnyApi, b: AnyApi) =>
            a.value.minus(b.value)
          );

          // get the lowest reward stake of the validator, which is
          // the largest index - `maxNominatorRewardedPerValidator`,
          // or the first index if does not exist.
          const lowestRewardIndex = Math.max(
            others.length - maxNominatorRewardedPerValidator.toNumber(),
            0
          );

          const lowestReward =
            others.length > 0
              ? planckToUnit(others[lowestRewardIndex]?.value, units)
              : 0;

          stake.push({
            total: validator.total,
            own: validator.own,
            total_nominations: totalNominations,
            lowestReward,
          });
        }

        // check if batch still exists before updating
        if (validatorMetaBatchesRef.current[key]) {
          setStateWithRef(
            {
              ...validatorMetaBatchesRef.current,
              [key]: {
                ...validatorMetaBatchesRef.current[key],
                stake,
              },
            },
            setValidatorMetaBatch,
            validatorMetaBatchesRef
          );
        }
      }
    );

    addMetaBatchUnsubs(key, [unsub3]);
  };

  /*
   * Helper function to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: Fn[]) => {
    const newUnsubs = validatorSubsRef.current;
    const keyUnsubs = newUnsubs[key] ?? [];

    keyUnsubs.push(...unsubs);
    newUnsubs[key] = keyUnsubs;
    validatorSubsRef.current = newUnsubs;
  };

  const removeValidatorMetaBatch = (key: string) => {
    if (validatorSubsRef.current[key] !== undefined) {
      // ubsubscribe from updates
      for (const unsub of validatorSubsRef.current[key]) {
        unsub();
      }
      // wipe data
      const updatedValidatorMetaBatches: AnyMetaBatch = {
        ...validatorMetaBatchesRef.current,
      };
      delete updatedValidatorMetaBatches[key];
      setStateWithRef(
        updatedValidatorMetaBatches,
        setValidatorMetaBatch,
        validatorMetaBatchesRef
      );
    }
  };

  /*
   * Adds a favorite validator.
   */
  const addFavorite = (address: string) => {
    const newFavorites: any = Object.assign(favorites);
    if (!newFavorites.includes(address)) {
      newFavorites.push(address);
    }

    localStorage.setItem(
      `${network.name}_favorites`,
      JSON.stringify(newFavorites)
    );
    setFavorites([...newFavorites]);
  };

  /*
   * Removes a favorite validator if they exist.
   */
  const removeFavorite = (address: string) => {
    const newFavorites = Object.assign(favorites).filter(
      (validator: string) => validator !== address
    );
    localStorage.setItem(
      `${network.name}_favorites`,
      JSON.stringify(newFavorites)
    );
    setFavorites([...newFavorites]);
  };

  return (
    <ValidatorsContext.Provider
      value={{
        fetchValidatorMetaBatch,
        removeValidatorMetaBatch,
        addFavorite,
        removeFavorite,
        validators,
        avgCommission,
        meta: validatorMetaBatchesRef.current,
        sessionValidators,
        sessionParaValidators,
        favorites,
        nominated,
        poolNominated,
        favoritesList,
        validatorCommunity,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  );
};

export const ValidatorsContext =
  React.createContext<ValidatorsContextInterface>(defaultValidatorsContext);

export const useValidators = () => React.useContext(ValidatorsContext);
