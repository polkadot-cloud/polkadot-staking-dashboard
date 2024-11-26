// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { AnyJson, Sync } from '@w3ux/types';
import { setStateWithRef, shuffle } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { ApiController } from 'controllers/Api';
import { SyncController } from 'controllers/Sync';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import { BondedPools } from 'model/Entries/BondedPools';
import { NominatorsMulti } from 'model/Query/NominatorsMulti';
import { PoolMetadataMulti } from 'model/Query/PoolMetadataMulti';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { AnyApi, MaybeAddress } from 'types';
import { useApi } from '../../Api';
import { defaultBondedPoolsContext } from './defaults';
import type {
  BondedPool,
  BondedPoolsContextState,
  MaybePool,
  NominationStatuses,
  PoolNominations,
  PoolTab,
} from './types';

export const BondedPoolsContext = createContext<BondedPoolsContextState>(
  defaultBondedPoolsContext
);

export const useBondedPools = () => useContext(BondedPoolsContext);

export const BondedPoolsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const {
    isReady,
    activeEra,
    poolsConfig: { lastPoolId },
  } = useApi();
  const createPoolAccounts = useCreatePoolAccounts();
  const { getNominationsStatusFromTargets } = useStaking();

  // Store bonded pools. Used implicitly in callbacks, ref is also defined.
  const [bondedPools, setBondedPools] = useState<BondedPool[]>([]);
  const bondedPoolsRef = useRef(bondedPools);

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

  // Store pool list active tab. Defaults to `Active` tab.
  const [poolListActiveTab, setPoolListActiveTab] = useState<PoolTab>('Active');

  // Fetch all bonded pool entries and their metadata.
  const fetchBondedPools = async () => {
    const { pApi } = ApiController.get(network);

    if (!pApi || bondedPoolsSynced.current !== 'unsynced') {
      return;
    }
    bondedPoolsSynced.current = 'syncing';

    // Get and format bonded pool entries.
    const ids: number[] = [];
    const idsMulti: [number][] = [];
    const bondedPoolsEntries = (await new BondedPools(pApi).fetch()).format();

    const exposures = shuffle(
      Object.entries(bondedPoolsEntries).map(([id, pool]: AnyApi) => {
        ids.push(id);
        idsMulti.push([id]);
        return getPoolWithAddresses(id, pool);
      })
    );

    setStateWithRef(exposures, setBondedPools, bondedPoolsRef);

    // Fetch pools metadata.
    const metadataQuery = await new PoolMetadataMulti(pApi, idsMulti).fetch();
    setPoolsMetadata(
      Object.fromEntries(metadataQuery.map((m, i) => [ids[i], m]))
    );

    bondedPoolsSynced.current = 'synced';
    SyncController.dispatch('bonded-pools', 'complete');
  };

  // Fetches pool nominations and updates state.
  const fetchPoolsNominations = async () => {
    const { pApi } = ApiController.get(network);
    if (!pApi) {
      return;
    }

    const ids: number[] = [];
    const stashes: [string][] = bondedPools.map(({ addresses, id }) => {
      ids.push(id);
      return [addresses.stash];
    });
    const nominationsMulti = await new NominatorsMulti(pApi, stashes).fetch();
    setPoolsNominations(formatPoolsNominations(nominationsMulti, ids));
  };

  // Format raw pool nominations data.
  const formatPoolsNominations = (raw: AnyJson, ids: number[]) =>
    Object.fromEntries(
      raw.map((nominator: AnyJson, i: number) => {
        if (!nominator) {
          return [ids[i], null];
        }
        return [ids[i], { ...nominator }];
      })
    );

  // Queries a bonded pool and injects ID and addresses to a result.
  const queryBondedPool = async (id: number) => {
    const { pApi } = ApiController.get(network);
    const bondedPool = new BondedPools(pApi).fetchOne(id);

    if (!bondedPool) {
      return null;
    }
    return {
      id,
      addresses: createPoolAccounts(id),
      ...bondedPool,
    };
  };

  // Get bonded pool nomination statuses
  const getPoolNominationStatus = (
    nominator: MaybeAddress,
    nomination: MaybeAddress
  ) => {
    const pool = bondedPools.find((p) => p.addresses.stash === nominator);

    if (!pool) {
      return 'waiting';
    }

    // get pool targets from nominations metadata
    const nominations = poolsNominations[pool.id];
    const targets = nominations ? nominations.targets : [];
    const target = targets.find((t) => t === nomination);

    if (!target) {
      return 'waiting';
    }

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
    addresses: createPoolAccounts(id),
  });

  const getBondedPool = (poolId: MaybePool) =>
    bondedPools.find((p) => String(p.id) === String(poolId)) ?? null;

  /*
   * poolSearchFilter Iterates through the supplied list and refers to the meta batch of the list to
   * filter those list items that match the search term. Returns the updated filtered list.
   */
  const poolSearchFilter = (list: AnyJson, searchTerm: string) => {
    const filteredList: AnyJson = [];

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

      if (pool.id.includes(searchTerm.toLowerCase())) {
        filteredList.push(pool);
      }
      if (address.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredList.push(pool);
      }
      if (metadataSearch.includes(searchTerm.toLowerCase())) {
        filteredList.push(pool);
      }
    }
    return filteredList;
  };

  const updateBondedPools = (updatedPools: BondedPool[]) => {
    if (!updatedPools) {
      return;
    }

    setStateWithRef(
      bondedPools.map(
        (original) =>
          updatedPools.find((updated) => updated.id === original.id) || original
      ),
      setBondedPools,
      bondedPoolsRef
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
    setStateWithRef(
      bondedPools.filter((b) => b.id !== id),
      setBondedPools,
      bondedPoolsRef
    );
  };

  // adds a record to bondedPools.
  // currently only used when a new pool is created.
  const addToBondedPools = (pool: BondedPool) => {
    if (!pool) {
      return;
    }

    const exists = bondedPools.find((b) => b.id === pool.id);
    if (!exists) {
      setStateWithRef(bondedPools.concat(pool), setBondedPools, bondedPoolsRef);
    }
  };

  // Determine roles to replace from roleEdits
  const toReplace = (roleEdits: AnyJson) => {
    const root = roleEdits?.root?.newAddress ?? '';
    const nominator = roleEdits?.nominator?.newAddress ?? '';
    const bouncer = roleEdits?.bouncer?.newAddress ?? '';

    return {
      root,
      nominator,
      bouncer,
    };
  };

  // Replaces the pool roles from roleEdits
  const replacePoolRoles = (poolId: number, roleEdits: AnyJson) => {
    let pool = bondedPools.find((b) => b.id === poolId) || null;

    if (!pool) {
      return;
    }

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

    setStateWithRef(newBondedPools, setBondedPools, bondedPoolsRef);
  };

  // Clear existing state for network refresh.
  useEffectIgnoreInitial(() => {
    bondedPoolsSynced.current = 'unsynced';
    SyncController.dispatch('bonded-pools', 'syncing');
    setStateWithRef([], setBondedPools, bondedPoolsRef);
    setPoolsMetadata({});
    setPoolsNominations({});
  }, [network]);

  // Initial setup for fetching bonded pools.
  useEffectIgnoreInitial(() => {
    if (isReady && lastPoolId) {
      fetchBondedPools();
    }
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
        replacePoolRoles,
        poolSearchFilter,
        bondedPools,
        poolsMetaData,
        poolsNominations,
        updatePoolNominations,
        poolListActiveTab,
        setPoolListActiveTab,
      }}
    >
      {children}
    </BondedPoolsContext.Provider>
  );
};
