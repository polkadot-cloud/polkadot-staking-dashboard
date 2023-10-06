// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero, shuffle } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { ValidatorCommunity } from '@polkadot-cloud/assets/validators';
import type { AnyApi, Fn, Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useBonded } from 'contexts/Bonded';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { useActiveAccount } from 'contexts/Connect/ActiveAccount';
import type {
  Identity,
  Validator,
  ValidatorAddresses,
  ValidatorSuper,
  ValidatorsContextInterface,
} from '../types';
import { defaultValidatorsData, defaultValidatorsContext } from './defaults';
import { getLocalEraValidators, setLocalEraValidators } from '../Utils';

export const ValidatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useNetwork();
  const { isReady, api } = useApi();
  const { poolNominations } = useActivePools();
  const { activeAccount } = useActiveAccount();
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
  const sessionUnsub = useRef<Fn>();

  // Stores the currently active parachain validator set.
  const [sessionParaValidators, setSessionParaValidators] = useState<string[]>(
    []
  );
  const sessionParaUnsub = useRef<Fn>();

  // Stores the average network commission rate.
  const [avgCommission, setAvgCommission] = useState(0);

  // stores the user's nominated validators as list
  const [nominated, setNominated] = useState<Validator[] | null>(null);

  // stores the nominated validators by the members pool's as list
  const [poolNominated, setPoolNominated] = useState<Validator[] | null>(null);

  // Stores a randomised validator community dataset.
  const [validatorCommunity] = useState<any>([...shuffle(ValidatorCommunity)]);

  // Reset validators list on network change.
  useEffectIgnoreInitial(() => {
    setValidatorsFetched('unsynced');
    setSessionValidators([]);
    setSessionParaValidators([]);
    setAvgCommission(0);
    setValidators([]);
    setValidatorIdentities({});
    setValidatorSupers({});
  }, [network]);

  // fetch validators and session validators when activeEra ready
  useEffectIgnoreInitial(() => {
    if (isReady && activeEra.index.isGreaterThan(0)) {
      fetchValidators();
      subscribeSessionValidators();
    }
  }, [isReady, activeEra]);

  // fetch parachain session validators when `earliestStoredSession` ready
  useEffectIgnoreInitial(() => {
    if (isReady && greaterThanZero(earliestStoredSession)) {
      subscribeParachainValidators();
    }
  }, [isReady, earliestStoredSession]);

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

      if (!commission.isEqualTo(100)) {
        totalNonAllCommission = totalNonAllCommission.plus(commission);
      } else {
        notFullCommissionCount++;
      }

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
    setValidatorsFetched('synced');
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

  return (
    <ValidatorsContext.Provider
      value={{
        fetchValidatorPrefs,
        validators,
        validatorIdentities,
        validatorSupers,
        avgCommission,
        sessionValidators,
        sessionParaValidators,
        nominated,
        poolNominated,
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
