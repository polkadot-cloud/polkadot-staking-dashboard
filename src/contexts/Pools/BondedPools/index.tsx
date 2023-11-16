// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { rmCommas, shuffle } from '@polkadot-cloud/utils';
import React, { useRef, useState } from 'react';
import type {
  BondedPool,
  BondedPoolsContextState,
  MaybePool,
  NominationStatuses,
  PoolNominations,
} from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import type { AnyApi, MaybeAddress, Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import type { AnyJson } from '@polkadot-cloud/react/types';
import { useApi } from '../../Api';
import { usePoolsConfig } from '../PoolsConfig';
import { defaultBondedPoolsContext } from './defaults';

export const BondedPoolsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useNetwork();
  const { api, isReady } = useApi();
  const { activeEra } = useNetworkMetrics();
  const { createAccounts, stats } = usePoolsConfig();
  const { getNominationsStatusFromTargets } = useStaking();
  const { lastPoolId } = stats;

  // Store bonded pools.
  const [bondedPools, setBondedPools] = useState<BondedPool[]>([]);

  // Track the sync status of `bondedPools`.
  const bondedPoolsSynced = useRef<Sync>('unsynced');

  // Store bonded pools metadata.
  const [poolsMetaData, setPoolsMetadata] = useState<Record<number, string>>(
    {}
  );

  // Store bonded pools nominations.
  const [poolsNominations, setPoolsNominations] = useState<
    Record<number, PoolNominations>
  >({});

  // Fetch all bonded pool entries and their metadata.
  const fetchBondedPools = async () => {
    if (!api || bondedPoolsSynced.current !== 'unsynced') return;
    bondedPoolsSynced.current = 'syncing';

    const ids: number[] = [];

    // Fetch bonded pools entries.
    const bondedPoolsMulti =
      await api.query.nominationPools.bondedPools.entries();
    let exposures = bondedPoolsMulti.map(([keys, val]: AnyApi) => {
      const id = keys.toHuman()[0];
      ids.push(id);
      return getPoolWithAddresses(id, val.toHuman());
    });

    exposures = shuffle(exposures);
    setBondedPools(exposures);

    // Fetch pools metadata.
    const metadataMulti = await api.query.nominationPools.metadata.multi(ids);
    setPoolsMetadata(
      Object.fromEntries(
        metadataMulti.map((m, i) => [ids[i], String(m.toHuman())])
      )
    );

    bondedPoolsSynced.current = 'synced';
  };

  // Fetches pool nominations and updates state.
  const fetchPoolsNominations = async () => {
    if (!api) return;

    const ids: number[] = [];
    const nominationsMulti = await api.query.staking.nominators.multi(
      bondedPools.map(({ addresses, id }) => {
        ids.push(id);
        return addresses.stash;
      })
    );
    setPoolsNominations(formatPoolsNominations(nominationsMulti, ids));
  };

  // Format raw pool nominations data.
  const formatPoolsNominations = (raw: AnyJson, ids: number[]) =>
    Object.fromEntries(
      raw.map((n: AnyJson, i: number) => {
        const human = n.toHuman() as PoolNominations;
        if (!human) return [ids[i], null];
        return [
          ids[i],
          {
            ...human,
            submittedIn: rmCommas(human.submittedIn),
          },
        ];
      })
    );

  // Queries a bonded pool and injects ID and addresses to a result.
  const queryBondedPool = async (id: number) => {
    if (!api) return null;

    const bondedPool: AnyApi = (
      await api.query.nominationPools.bondedPools(id)
    ).toHuman();

    if (!bondedPool) {
      return null;
    }
    return {
      id,
      addresses: createAccounts(id),
      ...bondedPool,
    };
  };

  // Get bonded pool nomination statuses
  const getPoolNominationStatus = (
    nominator: MaybeAddress,
    nomination: MaybeAddress
  ) => {
    const pool = bondedPools.find((p: any) => p.addresses.stash === nominator);

    if (!pool) return 'waiting';

    // get pool targets from nominations metadata
    const nominations = poolsNominations[pool.id];
    const targets = nominations ? nominations.targets : [];
    const target = targets.find((t) => t === nomination);

    const nominationStatus = getNominationsStatusFromTargets(nominator, [
      target,
    ]);
    return getPoolNominationStatusCode(nominationStatus);
  };

  /*
   * Determine bonded pool's current nomination statuse
   */
  const getPoolNominationStatusCode = (statuses: NominationStatuses | null) => {
    let status = 'waiting';

    if (statuses) {
      for (const childStatus of Object.values(statuses)) {
        if (childStatus === 'active') {
          status = 'active';
          break;
        }
        if (childStatus === 'inactive') {
          status = 'inactive';
        }
      }
    }
    return status;
  };

  /*
   *  Helper: to add addresses to pool record.
   */
  const getPoolWithAddresses = (id: number, pool: BondedPool) => ({
    ...pool,
    id,
    addresses: createAccounts(id),
  });

  const getBondedPool = (poolId: MaybePool) =>
    bondedPools.find((p) => p.id === poolId) ?? null;

  /*
   * poolSearchFilter Iterates through the supplied list and refers to the meta batch of the list to
   * filter those list items that match the search term. Returns the updated filtered list.
   */
  const poolSearchFilter = (list: any, searchTerm: string) => {
    const filteredList: any = [];

    for (const pool of list) {
      // If pool metadata has not yet been synced, include the pool in results.
      if (!Object.values(poolsMetaData).length) {
        filteredList.push(pool);
        continue;
      }

      const address = pool?.addresses?.stash ?? '';
      const metadata = poolsMetaData[pool.id] || '';
      const metadataAsBytes = u8aToString(u8aUnwrapBytes(metadata));
      const metadataSearch = (
        metadataAsBytes === '' ? metadata : metadataAsBytes
      ).toLowerCase();

      if (pool.id.includes(searchTerm.toLowerCase())) filteredList.push(pool);
      if (address.toLowerCase().includes(searchTerm.toLowerCase()))
        filteredList.push(pool);
      if (metadataSearch.includes(searchTerm.toLowerCase()))
        filteredList.push(pool);
    }
    return filteredList;
  };

  const updateBondedPools = (updatedPools: BondedPool[]) => {
    if (!updatedPools) return;
    setBondedPools(
      bondedPools.map(
        (original) =>
          updatedPools.find((updated) => updated.id === original.id) || original
      )
    );
  };

  const updatePoolNominations = (id: number, newTargets: string[]) => {
    const newPoolsNominations = { ...poolsNominations };

    let record = newPoolsNominations?.[id];
    if (record !== null) {
      record.targets = newTargets;
    } else {
      record = {
        submittedIn: activeEra.index.toString(),
        targets: newTargets,
        suppressed: false,
      };
    }
    setPoolsNominations(newPoolsNominations);
  };

  const removeFromBondedPools = (id: number) => {
    setBondedPools(bondedPools.filter((b: BondedPool) => b.id !== id));
  };

  // adds a record to bondedPools.
  // currently only used when a new pool is created.
  const addToBondedPools = (pool: BondedPool) => {
    if (!pool) return;

    const exists = bondedPools.find((b) => b.id === pool.id);
    if (!exists) setBondedPools(bondedPools.concat(pool));
  };

  // get all the roles belonging to one pool account
  const getAccountRoles = (who: MaybeAddress) => {
    if (!who) {
      return {
        depositor: [],
        root: [],
        nominator: [],
        bouncer: [],
      };
    }

    const depositor = bondedPools
      .filter((b) => b.roles.depositor === who)
      .map((b) => b.id);

    const root = bondedPools
      .filter((b: BondedPool) => b.roles.root === who)
      .map((b) => b.id);

    const nominator = bondedPools
      .filter((b) => b.roles.nominator === who)
      .map((b) => b.id);

    const bouncer = bondedPools
      .filter((b) => b.roles.bouncer === who)
      .map((b) => b.id);

    return {
      depositor,
      root,
      nominator,
      bouncer,
    };
  };

  // accumulate account pool list
  const getAccountPools = (who: MaybeAddress) => {
    // first get the roles of the account
    const roles = getAccountRoles(who);
    // format new list has pool => roles
    const pools: any = {};
    Object.entries(roles).forEach(([key, poolIds]: any) => {
      // now looping through a role
      poolIds.forEach((poolId: string) => {
        const exists = Object.keys(pools).find((k) => k === poolId);
        if (!exists) {
          pools[poolId] = [key];
        } else {
          pools[poolId].push(key);
        }
      });
    });
    return pools;
  };

  // determine roles to replace from roleEdits
  const toReplace = (roleEdits: any) => {
    const root = roleEdits?.root?.newAddress ?? '';
    const nominator = roleEdits?.nominator?.newAddress ?? '';
    const bouncer = roleEdits?.bouncer?.newAddress ?? '';

    return {
      root,
      nominator,
      bouncer,
    };
  };

  // replaces the pool roles from roleEdits
  const replacePoolRoles = (poolId: number, roleEdits: any) => {
    let pool = bondedPools.find((b) => b.id === poolId) || null;

    if (!pool) return;

    pool = {
      ...pool,
      roles: {
        ...pool.roles,
        ...toReplace(roleEdits),
      },
    };

    const newBondedPools = [
      ...bondedPools.map((b) => (b.id === poolId && pool !== null ? pool : b)),
    ];

    setBondedPools(newBondedPools);
  };

  // Clear existing state for network refresh.
  useEffectIgnoreInitial(() => {
    bondedPoolsSynced.current = 'unsynced';
    setBondedPools([]);
    setPoolsMetadata({});
    setPoolsNominations({});
  }, [network]);

  // Initial setup for fetching bonded pools.
  useEffectIgnoreInitial(() => {
    if (isReady && lastPoolId) fetchBondedPools();
  }, [bondedPools, isReady, lastPoolId]);

  // Re-fetch bonded pools nominations when active era changes or when `bondedPools` update.
  useEffectIgnoreInitial(() => {
    if (!activeEra.index.isZero() && bondedPools.length) {
      fetchPoolsNominations();
    }
  }, [activeEra.index, bondedPools.length]);

  return (
    <BondedPoolsContext.Provider
      value={{
        queryBondedPool,
        getBondedPool,
        updateBondedPools,
        addToBondedPools,
        removeFromBondedPools,
        getPoolNominationStatus,
        getPoolNominationStatusCode,
        getAccountRoles,
        getAccountPools,
        replacePoolRoles,
        poolSearchFilter,
        bondedPools,
        poolsMetaData,
        poolsNominations,
        updatePoolNominations,
      }}
    >
      {children}
    </BondedPoolsContext.Provider>
  );
};

export const BondedPoolsContext = React.createContext<BondedPoolsContextState>(
  defaultBondedPoolsContext
);

export const useBondedPools = () => React.useContext(BondedPoolsContext);
