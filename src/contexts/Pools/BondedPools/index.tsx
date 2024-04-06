// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { rmCommas, setStateWithRef, shuffle } from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  AccountPoolRoles,
  BondedPool,
  BondedPoolsContextState,
  MaybePool,
  NominationStatuses,
  PoolNominations,
  PoolTab,
} from './types';
import { useStaking } from 'contexts/Staking';
import type { AnyApi, AnyJson, MaybeAddress, Sync } from 'types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useApi } from '../../Api';
import { defaultBondedPoolsContext } from './defaults';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import { SyncController } from 'controllers/SyncController';

export const BondedPoolsContext = createContext<BondedPoolsContextState>(
  defaultBondedPoolsContext
);

export const useBondedPools = () => useContext(BondedPoolsContext);

export const BondedPoolsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const {
    api,
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
    if (!api || bondedPoolsSynced.current !== 'unsynced') {
      return;
    }
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
    setStateWithRef(exposures, setBondedPools, bondedPoolsRef);

    // Fetch pools metadata.
    const metadataMulti = await api.query.nominationPools.metadata.multi(ids);
    setPoolsMetadata(
      Object.fromEntries(
        metadataMulti.map((m, i) => [ids[i], String(m.toHuman())])
      )
    );

    bondedPoolsSynced.current = 'synced';
    SyncController.dispatch('bonded-pools', 'complete');
  };

  // Fetches pool nominations and updates state.
  const fetchPoolsNominations = async () => {
    if (!api) {
      return;
    }

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
        if (!human) {
          return [ids[i], null];
        }
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
    if (!api) {
      return null;
    }

    const bondedPool: AnyApi = (
      await api.query.nominationPools.bondedPools(id)
    ).toHuman();

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

  // Gets all pools that the account has a role in. Returns an object with each pool role as keys,
  // and array of pool ids as their values.
  const accumulateAccountPoolRoles = (who: MaybeAddress): AccountPoolRoles => {
    if (!who) {
      return {
        root: [],
        depositor: [],
        nominator: [],
        bouncer: [],
      };
    }

    const depositor = bondedPoolsRef.current
      .filter((b) => b.roles.depositor === who)
      .map((b) => b.id);

    const root = bondedPoolsRef.current
      .filter((b: BondedPool) => b.roles.root === who)
      .map((b) => b.id);

    const nominator = bondedPoolsRef.current
      .filter((b) => b.roles.nominator === who)
      .map((b) => b.id);

    const bouncer = bondedPoolsRef.current
      .filter((b) => b.roles.bouncer === who)
      .map((b) => b.id);

    const result = {
      root,
      depositor,
      nominator,
      bouncer,
    };

    return result;
  };

  // Gets a list of roles for all the pools the provided account has one or more roles in.
  const getAccountPoolRoles = (who: MaybeAddress) => {
    const allAccountRoles = accumulateAccountPoolRoles(who);

    // Reformat all roles object, keyed by pool id.
    const pools: Record<number, AnyJson> = {};

    if (allAccountRoles) {
      Object.entries(allAccountRoles).forEach(([role, poolIds]) => {
        poolIds.forEach((poolId) => {
          const exists = Object.keys(pools).find(
            (k) => String(k) === String(poolId)
          );
          if (!exists) {
            pools[poolId] = [role];
          } else {
            pools[poolId].push(role);
          }
        });
      });
    }
    return pools;
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
        getAccountPoolRoles,
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
