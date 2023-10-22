// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero, rmCommas, shuffle } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { ValidatorCommunity } from '@polkadot-cloud/assets/validators';
import type { AnyApi, AnyJson, BondFor, Fn, Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useBonded } from 'contexts/Bonded';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { MaxEraRewardPointsEras } from 'consts';
import { useStaking } from 'contexts/Staking';
import type {
  EraPointsBoundaries,
  ErasRewardPoints,
  Identity,
  Validator,
  ValidatorAddresses,
  ValidatorSuper,
  ValidatorListEntry,
  ValidatorsContextInterface,
  ValidatorEraPointHistory,
} from '../types';
import {
  defaultValidatorsData,
  defaultValidatorsContext,
  defaultEraPointsBoundaries,
} from './defaults';
import { getLocalEraValidators, setLocalEraValidators } from '../Utils';

export const ValidatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useNetwork();
  const { isReady, api } = useApi();
  const { stakers } = useStaking().eraStakers;
  const { poolNominations } = useActivePools();
  const { activeAccount } = useActiveAccounts();
  const { activeEra, metrics } = useNetworkMetrics();
  const { bondedAccounts, getAccountNominations } = useBonded();
  const { earliestStoredSession } = metrics;

  // Stores all validator entries.
  const [validators, setValidators] = useState<Validator[]>([]);

  // Track whether the validator list has been fetched.
  const [validatorsFetched, setValidatorsFetched] = useState<Sync>('unsynced');

  // Store validator identity data.
  const [validatorIdentities, setValidatorIdentities] = useState<
    Record<string, Identity>
  >({});

  // Store validator super identity data.
  const [validatorSupers, setValidatorSupers] = useState<
    Record<string, ValidatorSuper>
  >({});

  // Stores the currently active validator set.
  const [sessionValidators, setSessionValidators] = useState<string[]>([]);

  // Stores the currently active parachain validator set.
  const [sessionParaValidators, setSessionParaValidators] = useState<string[]>(
    []
  );

  // Stores unsub object for para session.
  const sessionParaUnsub = useRef<Fn>();

  // Stores the average network commission rate.
  const [avgCommission, setAvgCommission] = useState(0);

  // Stores the user's nominated validators as list
  const [nominated, setNominated] = useState<Validator[] | null>(null);

  // Stores the nominated validators by the members pool's as list
  const [poolNominated, setPoolNominated] = useState<Validator[] | null>(null);

  // Stores a randomised validator community dataset.
  const [validatorCommunity] = useState([...shuffle(ValidatorCommunity)]);

  // Track whether the validator list has been fetched.
  const [erasRewardPointsFetched, setErasRewawrdPointsFetched] =
    useState<Sync>('unsynced');

  // Store era reward points, keyed by era.
  const [erasRewardPoints, setErasRewardPoints] = useState<ErasRewardPoints>(
    {}
  );

  // Store validator era points history and metrics.
  const [validatorEraPointsHistory, setValidatorEraPointsHistory] = useState<
    Record<string, ValidatorEraPointHistory>
  >({});

  // Store era point high and low for `MaxEraPointsEras` eras.
  const [eraPointsBoundaries, setEraPointsBoundaries] =
    useState<EraPointsBoundaries>(defaultEraPointsBoundaries);

  // Processes reward points for a given era.
  const processEraRewardPoints = (result: AnyJson, era: BigNumber) => {
    if (erasRewardPoints[era.toString()])
      return erasRewardPoints[era.toString()];

    return {
      total: rmCommas(result.total),
      individual: Object.fromEntries(
        Object.entries(result.individual).map(([key, value]) => [
          key,
          rmCommas(value as string),
        ])
      ),
    };
  };

  // Get quartile data for validator performance data.
  const getQuartile = (qIndex: number, total: number) => {
    const q1 = Math.ceil(total * 0.25);
    const q2 = Math.ceil(total * 0.5);
    const q3 = Math.ceil(total * 0.75);

    if (qIndex <= q1) return 25;
    if (qIndex <= q2) return 50;
    if (qIndex <= q3) return 75;
    return 100;
  };

  // Fetches era reward points for eligible eras.
  const fetchErasRewardPoints = async () => {
    if (
      activeEra.index.isZero() ||
      !api ||
      erasRewardPointsFetched !== 'unsynced'
    )
      return;

    setErasRewawrdPointsFetched('syncing');

    // start fetching from the current era.
    let currentEra = BigNumber.max(activeEra.index.minus(1), 1);
    const endEra = BigNumber.max(
      currentEra.minus(MaxEraRewardPointsEras - 1),
      1
    );

    // Introduce additional safeguard againt looping forever.
    const totalEras = new BigNumber(MaxEraRewardPointsEras);
    let erasProcessed = new BigNumber(0);

    // Iterate eras and process reward points.
    const calls = [];
    const eras = [];
    do {
      calls.push(api.query.staking.erasRewardPoints(currentEra.toString()));
      eras.push(currentEra);

      currentEra = currentEra.minus(1);
      erasProcessed = erasProcessed.plus(1);
    } while (
      currentEra.isGreaterThanOrEqualTo(endEra) &&
      erasProcessed.isLessThan(totalEras)
    );

    // Make calls and format reward point results.
    const newErasRewardPoints: ErasRewardPoints = {};
    let i = 0;
    for (const result of await Promise.all(calls)) {
      const formatted = processEraRewardPoints(result.toHuman(), eras[i]);
      if (formatted) newErasRewardPoints[eras[i].toString()] = formatted;
      i++;
    }

    let newEraPointsHistory: Record<string, ValidatorEraPointHistory> = {};

    // Calculate points per era and total points per era of each validator.
    Object.entries(newErasRewardPoints).forEach(([era, { individual }]) => {
      Object.entries(individual).forEach(([address, points]) => {
        if (!newEraPointsHistory[address])
          newEraPointsHistory[address] = {
            eras: {},
            totalPoints: new BigNumber(0),
          };
        else {
          newEraPointsHistory[address].eras[era] = new BigNumber(points);
          newEraPointsHistory[address].totalPoints =
            newEraPointsHistory[address].totalPoints.plus(points);
        }
      });
    });

    // Iterate `newEraPointsHistory` and re-order the object based on its totalPoints, highest
    // first.
    newEraPointsHistory = Object.fromEntries(
      Object.entries(newEraPointsHistory)
        .sort(
          (
            a: [string, ValidatorEraPointHistory],
            b: [string, ValidatorEraPointHistory]
          ) => a[1].totalPoints.minus(b[1].totalPoints).toNumber()
        )
        .reverse()
    );

    const totalEntries = Object.entries(newEraPointsHistory).length;
    let j = 0;
    newEraPointsHistory = Object.fromEntries(
      Object.entries(newEraPointsHistory).map(([k, v]) => {
        j++;
        return [k, { ...v, rank: j, quartile: getQuartile(j, totalEntries) }];
      })
    );

    // Commit results to state.
    setErasRewardPoints({
      ...newErasRewardPoints,
    });
    setValidatorEraPointsHistory(newEraPointsHistory);
  };

  // Fetches the active account's nominees.
  const fetchNominatedList = async () => {
    if (!activeAccount) return;

    // format to list format
    const targetsFormatted = getAccountNominations(activeAccount).map(
      (item) => ({ address: item })
    );
    // fetch preferences
    const nominationsWithPrefs = await fetchValidatorPrefs(targetsFormatted);
    setNominated(nominationsWithPrefs || []);
  };

  // Fetches the active pool's nominees.
  const fetchPoolNominatedList = async () => {
    // get raw nominations list
    let n = poolNominations.targets;
    // format to list format
    n = n.map((item: string) => ({ address: item }));
    // fetch preferences
    const nominationsWithPrefs = await fetchValidatorPrefs(n);
    setPoolNominated(nominationsWithPrefs || []);
  };

  // Fetch validator entries and format the returning data.
  const getValidatorEntries = async () => {
    if (!isReady || !api) return defaultValidatorsData;

    const result = await api.query.staking.validators.entries();

    const entries: Validator[] = [];
    let notFullCommissionCount = 0;
    let totalNonAllCommission = new BigNumber(0);
    result.forEach(([a, p]: AnyApi) => {
      const address = a.toHuman().pop();
      const prefs = p.toHuman();
      const commission = new BigNumber(prefs.commission.replace(/%/g, ''));

      if (!commission.isEqualTo(100))
        totalNonAllCommission = totalNonAllCommission.plus(commission);
      else notFullCommissionCount++;

      entries.push({
        address,
        prefs: {
          commission: Number(commission.toFixed(2)),
          blocked: prefs.blocked,
        },
      });
    });

    return { entries, notFullCommissionCount, totalNonAllCommission };
  };

  // Fetches and formats the active validator set, and derives metrics from the result.
  const fetchValidators = async () => {
    if (!isReady || !api || validatorsFetched !== 'unsynced') return;
    setValidatorsFetched('syncing');

    // If local validator entries exist for the current era, store these values in state. Otherwise,
    // fetch entries from API.
    const localEraValidators = getLocalEraValidators(
      network,
      activeEra.index.toString()
    );

    // The validator entries for the current active era.
    let validatorEntries: Validator[] = [];
    // Average network commission for all non-100% commissioned validators.
    let avg = 0;

    if (localEraValidators) {
      validatorEntries = localEraValidators.entries;
      avg = localEraValidators.avgCommission;
    } else {
      const { entries, notFullCommissionCount, totalNonAllCommission } =
        await getValidatorEntries();

      validatorEntries = entries;
      avg = notFullCommissionCount
        ? totalNonAllCommission
            .dividedBy(notFullCommissionCount)
            .decimalPlaces(2)
            .toNumber()
        : 0;
    }

    // Set entries data for the era to local storage.
    setLocalEraValidators(
      network,
      activeEra.index.toString(),
      validatorEntries,
      avg
    );
    setAvgCommission(avg);
    // Validators are shuffled before committed to state.
    setValidators(shuffle(validatorEntries));

    const addresses = validatorEntries.map(({ address }) => address);
    const [identities, supers] = await Promise.all([
      fetchValidatorIdentities(addresses),
      fetchValidatorSupers(addresses),
    ]);
    setValidatorIdentities(identities);
    setValidatorSupers(supers);
    setValidatorsFetched('synced');
  };

  // Subscribe to active session validators.
  const fetchSessionValidators = async () => {
    if (!api || !isReady) return;
    const sessionValidatorsRaw: AnyApi = await api.query.session.validators();
    setSessionValidators(sessionValidatorsRaw.toHuman());
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

  // Fetches validator identities.
  const fetchValidatorIdentities = async (addresses: string[]) => {
    if (!api) return {};

    const identities: AnyApi[] = (
      await api.query.identity.identityOf.multi(addresses)
    ).map((identity) => identity.toHuman());

    return Object.fromEntries(
      Object.entries(
        Object.fromEntries(identities.map((k, i) => [addresses[i], k]))
      ).filter(([, v]) => v !== null)
    );
  };

  // Fetch validator super accounts and their identities.
  const fetchValidatorSupers = async (addresses: string[]) => {
    if (!api) return {};

    const supersRaw: AnyApi[] = (
      await api.query.identity.superOf.multi(addresses)
    ).map((superOf) => superOf.toHuman());

    const supers = Object.fromEntries(
      Object.entries(
        Object.fromEntries(
          supersRaw.map((k, i) => [
            addresses[i],
            {
              superOf: k,
            },
          ])
        )
      ).filter(([, { superOf }]) => superOf !== null)
    );

    const superIdentities = (
      await api.query.identity.identityOf.multi(
        Object.values(supers).map(({ superOf }) => superOf[0])
      )
    ).map((superIdentity) => superIdentity.toHuman());

    const supersWithIdentity = Object.fromEntries(
      Object.entries(supers).map(([k, v]: AnyApi, i) => [
        k,
        {
          ...v,
          identity: superIdentities[i],
        },
      ])
    );
    return supersWithIdentity;
  };

  // Gets era points for a validator
  const getValidatorPointsFromEras = (startEra: BigNumber, address: string) => {
    startEra = BigNumber.max(startEra, 1);

    // minus 1 from `MaxRewardPointsEras` to account for the current era.
    const endEra = BigNumber.max(startEra.minus(MaxEraRewardPointsEras - 1), 1);

    const points: Record<string, BigNumber> = {};
    let currentEra = startEra;
    do {
      const eraPoints = erasRewardPoints[currentEra.toString()];
      if (eraPoints) {
        const validatorPoints = eraPoints.individual[address];
        points[currentEra.toString()] = new BigNumber(validatorPoints || 0);
      } else {
        points[currentEra.toString()] = new BigNumber(0);
      }
      currentEra = currentEra.minus(1);
    } while (currentEra.isGreaterThanOrEqualTo(endEra));

    return points;
  };

  // Gets the highest and lowest (non-zero) era points earned `MaxEraRewardPointsEras` timeframe.
  const calculateEraPointsBoundaries = () => {
    let high: BigNumber | null = null;
    let low: BigNumber | null = null;

    Object.entries(erasRewardPoints).forEach(([, { individual }]) => {
      for (const [, points] of Object.entries(individual)) {
        const p = new BigNumber(points);

        if (p.isGreaterThan(high || 0)) high = p;
        if (low === null) low = p;
        else if (p.isLessThan(low) && !p.isZero()) low = p;
      }
    });

    setEraPointsBoundaries({
      high: high || new BigNumber(0),
      low: low || new BigNumber(0),
    });
    setErasRewawrdPointsFetched('synced');
  };

  // Gets either `nominated` or `poolNominated` depending on bondFor, and injects the validator
  // status into the entries.
  const getNominated = (bondFor: BondFor) =>
    bondFor === 'nominator' ? nominated : poolNominated;

  // Inject status into validator entries.
  const injectValidatorListData = (
    entries: Validator[]
  ): ValidatorListEntry[] => {
    const injected: ValidatorListEntry[] =
      entries.map((entry) => {
        const inEra =
          stakers.find(({ address }) => address === entry.address) || false;
        let totalStake = new BigNumber(0);
        if (inEra) {
          const { others, own } = inEra;
          if (own) totalStake = totalStake.plus(own);
          others.forEach(({ value }) => {
            totalStake = totalStake.plus(value);
          });
        }
        return {
          ...entry,
          totalStake,
          validatorStatus: inEra ? 'active' : 'waiting',
        };
      }) || [];
    return injected;
  };

  // Reset validator state data on network change.
  useEffectIgnoreInitial(() => {
    setValidatorsFetched('unsynced');
    setErasRewawrdPointsFetched('unsynced');
    setSessionValidators([]);
    setSessionParaValidators([]);
    setAvgCommission(0);
    setValidators([]);
    setValidatorIdentities({});
    setValidatorSupers({});
    setErasRewardPoints({});
    setEraPointsBoundaries(null);
    setValidatorEraPointsHistory({});
  }, [network]);

  // Fetch validators and era reward points when fetched status changes.
  useEffect(() => {
    if (isReady && activeEra.index.isGreaterThan(0)) {
      fetchValidators();
      fetchErasRewardPoints();
    }
  }, [validatorsFetched, erasRewardPointsFetched, isReady, activeEra]);

  // Mark unsynced and fetch session validators when activeEra changes.
  useEffectIgnoreInitial(() => {
    if (isReady && activeEra.index.isGreaterThan(0)) {
      if (erasRewardPointsFetched === 'synced')
        setErasRewawrdPointsFetched('unsynced');

      if (validatorsFetched === 'synced') setValidatorsFetched('unsynced');
      fetchSessionValidators();
    }
  }, [isReady, activeEra]);

  // Fetch era points boundaries when `erasRewardPoints` ready.
  useEffectIgnoreInitial(() => {
    if (isReady && Object.values(erasRewardPoints).length)
      calculateEraPointsBoundaries();
  }, [isReady, erasRewardPoints]);

  // Fetch parachain session validators when `earliestStoredSession` ready.
  useEffectIgnoreInitial(() => {
    if (isReady && greaterThanZero(earliestStoredSession))
      subscribeParachainValidators();
  }, [isReady, earliestStoredSession]);

  // Fetch active account's nominations in validator list format.
  useEffectIgnoreInitial(() => {
    if (isReady && activeAccount) {
      fetchNominatedList();
    }
  }, [isReady, activeAccount, bondedAccounts]);

  // Fetch active account's pool nominations in validator list format.
  useEffectIgnoreInitial(() => {
    if (isReady && poolNominations) fetchPoolNominatedList();
  }, [isReady, poolNominations]);

  // Unsubscribe on network change and component unmount.
  useEffect(() => {
    if (sessionParaValidators.length) sessionParaUnsub.current?.();

    return () => {
      sessionParaUnsub.current?.();
    };
  }, [network]);

  return (
    <ValidatorsContext.Provider
      value={{
        fetchValidatorPrefs,
        getValidatorPointsFromEras,
        getNominated,
        injectValidatorListData,
        validators,
        validatorIdentities,
        validatorSupers,
        avgCommission,
        sessionValidators,
        sessionParaValidators,
        nominated,
        poolNominated,
        validatorCommunity,
        erasRewardPoints,
        validatorsFetched,
        eraPointsBoundaries,
        validatorEraPointsHistory,
        erasRewardPointsFetched,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  );
};

export const ValidatorsContext =
  React.createContext<ValidatorsContextInterface>(defaultValidatorsContext);

export const useValidators = () => React.useContext(ValidatorsContext);
