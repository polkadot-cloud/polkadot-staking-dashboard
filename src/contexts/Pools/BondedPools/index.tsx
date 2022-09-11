// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import {
  BondedPool,
  BondedPoolsContextState,
  MaybePool,
  NominationStatuses,
} from 'contexts/Pools/types';
import { AnyApi, AnyMetaBatch, Fn, MaybeAccount } from 'types';
import { setStateWithRef } from 'Utils';
import { useStaking } from 'contexts/Staking';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { useApi } from '../../Api';
import { usePoolsConfig } from '../PoolsConfig';
import { defaultBondedPoolsContext } from './defaults';

export const BondedPoolsContext = React.createContext<BondedPoolsContextState>(
  defaultBondedPoolsContext
);

export const useBondedPools = () => React.useContext(BondedPoolsContext);

export const BondedPoolsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady } = useApi();
  const { getNominationsStatusFromTargets } = useStaking();
  const { enabled, createAccounts, stats } = usePoolsConfig();
  const { lastPoolId } = stats;

  // stores the meta data batches for pool lists
  const [poolMetaBatches, setPoolMetaBatch]: AnyMetaBatch = useState({});
  const poolMetaBatchesRef = useRef(poolMetaBatches);

  // stores the meta batch subscriptions for pool lists
  const [poolSubs, setPoolSubs] = useState<{
    [key: string]: Array<Fn>;
  }>({});
  const poolSubsRef = useRef(poolSubs);

  // store bonded pools
  const [bondedPools, setBondedPools] = useState<Array<BondedPool>>([]);

  // clear existing state for network refresh
  useEffect(() => {
    setBondedPools([]);
    setStateWithRef({}, setPoolMetaBatch, poolMetaBatchesRef);
  }, [network]);

  // initial setup for fetching bonded pools
  useEffect(() => {
    if (isReady && enabled) {
      // fetch bonded pools
      fetchBondedPools();
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady, enabled, lastPoolId]);

  // after bonded pools have synced, fetch metabatch
  useEffect(() => {
    if (bondedPools.length) {
      fetchPoolsMetaBatch('bonded_pools', bondedPools, true);
    }
  }, [bondedPools]);

  const unsubscribe = () => {
    Object.values(poolSubsRef.current).map((batch: Array<Fn>) => {
      return Object.entries(batch).map(([, v]) => {
        return v();
      });
    });
    setBondedPools([]);
  };

  // fetch all bonded pool entries
  const fetchBondedPools = async () => {
    if (!api) return;

    const _exposures = await api.query.nominationPools.bondedPools.entries();
    const exposures = _exposures.map(([_keys, _val]: AnyApi) => {
      const id = _keys.toHuman()[0];
      const pool = _val.toHuman();
      return getPoolWithAddresses(id, pool);
    });
    setBondedPools(exposures);
  };

  // queries a bonded pool and injects ID and addresses to a result.
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

  /*
    Fetches a new batch of pool metadata.
    Fetches the metadata of a pool that we assume to be a string.
    structure:
    {
      key: {
        [
          {
          metadata: [],
        }
      ]
    },
  };
  */
  const fetchPoolsMetaBatch = async (
    key: string,
    p: AnyMetaBatch,
    refetch = false
  ) => {
    if (!isReady || !api) {
      return;
    }
    if (!p.length) {
      return;
    }
    if (!refetch) {
      // if already exists, do not re-fetch
      if (poolMetaBatchesRef.current[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      delete poolMetaBatches[key];
      delete poolMetaBatchesRef.current[key];

      if (poolSubsRef.current[key] !== undefined) {
        for (const unsub of poolSubsRef.current[key]) {
          unsub();
        }
      }
    }

    // aggregate pool ids and addresses
    const ids = [];
    const addresses = [];
    for (const _p of p) {
      ids.push(Number(_p.id));

      if (_p?.addresses?.stash) {
        addresses.push(_p.addresses.stash);
      }
    }

    // store batch ids
    const batchesUpdated = Object.assign(poolMetaBatchesRef.current);
    batchesUpdated[key] = {};
    batchesUpdated[key].ids = ids;
    setStateWithRef(
      { ...batchesUpdated },
      setPoolMetaBatch,
      poolMetaBatchesRef
    );

    const subscribeToMetadata = async (_ids: AnyApi) => {
      const unsub = await api.query.nominationPools.metadata.multi(
        _ids,
        (_metadata: AnyApi) => {
          const metadata = [];
          for (let i = 0; i < _metadata.length; i++) {
            metadata.push(_metadata[i].toHuman());
          }
          const _batchesUpdated = Object.assign(poolMetaBatchesRef.current);
          _batchesUpdated[key].metadata = metadata;

          setStateWithRef(
            { ..._batchesUpdated },
            setPoolMetaBatch,
            poolMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    const subscribeToNominators = async (_addresses: AnyApi) => {
      const unsub = await api.query.staking.nominators.multi(
        _addresses,
        (_nominations: AnyApi) => {
          const nominations = [];
          for (let i = 0; i < _nominations.length; i++) {
            nominations.push(_nominations[i].toHuman());
          }

          const _batchesUpdated = Object.assign(poolMetaBatchesRef.current);
          _batchesUpdated[key].nominations = nominations;

          setStateWithRef(
            { ..._batchesUpdated },
            setPoolMetaBatch,
            poolMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    // initiate subscriptions
    await Promise.all([
      subscribeToMetadata(ids),
      subscribeToNominators(addresses),
    ]).then((unsubs: Array<Fn>) => {
      addMetaBatchUnsubs(key, unsubs);
    });
  };

  /*
   * Get bonded pool nomination statuses
   */
  const getPoolNominationStatus = (
    nominator: MaybeAccount,
    nomination: MaybeAccount
  ) => {
    const pool = bondedPools.find((p: any) => p.addresses.stash === nominator);

    if (!pool) {
      return 'waiting';
    }
    // get pool targets from nominations metadata
    const batchIndex = bondedPools.indexOf(pool);
    const nominations = poolMetaBatches.bonded_pools?.nominations ?? [];
    const targets = nominations[batchIndex]?.targets ?? [];

    const target = targets.find((t: string) => t === nomination);

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
      for (const _status of Object.values(statuses)) {
        if (_status === 'active') {
          status = 'active';
          break;
        }
        if (_status === 'inactive') {
          status = 'inactive';
        }
      }
    }
    return status;
  };

  /*
   * Helper: to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: Array<Fn>) => {
    const _unsubs = poolSubsRef.current;
    const _keyUnsubs = _unsubs[key] ?? [];

    _keyUnsubs.push(...unsubs);
    _unsubs[key] = _keyUnsubs;
    setStateWithRef(_unsubs, setPoolSubs, poolSubsRef);
  };

  /*
   *  Helper: to add addresses to pool record.
   */
  const getPoolWithAddresses = (id: number, pool: BondedPool) => {
    return {
      ...pool,
      id,
      addresses: createAccounts(id),
    };
  };

  const getBondedPool = (poolId: MaybePool) => {
    const pool = bondedPools.find((p: BondedPool) => p.id === poolId) ?? null;
    return pool;
  };

  /*
   * poolSearchFilter
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that match
   * the search term.
   * Returns the updated filtered list.
   */
  const poolSearchFilter = (
    list: any,
    batchKey: string,
    searchTerm: string
  ) => {
    const meta = poolMetaBatchesRef.current;

    if (meta[batchKey] === undefined) {
      return list;
    }
    const filteredList: any = [];

    for (const pool of list) {
      const batchIndex = meta[batchKey].ids?.indexOf(Number(pool.id)) ?? -1;

      // if we cannot derive data, fallback to include pool in filtered list
      if (batchIndex === -1) {
        filteredList.push(pool);
        continue;
      }

      const metadatas = meta[batchKey]?.metadata ?? false;
      if (!metadatas) {
        filteredList.push(pool);
        continue;
      }

      const address = pool?.addresses?.stash ?? '';
      const metadata = metadatas[batchIndex] ?? '';

      const metadataAsBytes = u8aToString(u8aUnwrapBytes(metadata));
      const metadataSearch = (
        metadataAsBytes === '' ? metadata : metadataAsBytes
      ).toLowerCase();

      if (address.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredList.push(pool);
      }
      if (metadataSearch.includes(searchTerm.toLowerCase())) {
        filteredList.push(pool);
      }
    }
    return filteredList;
  };

  const updateBondedPools = (updatedPools: Array<BondedPool>) => {
    if (!updatedPools) {
      return;
    }
    const _bondedPools = bondedPools.map(
      (original: BondedPool) =>
        updatedPools.find(
          (updated: BondedPool) => updated.id === original.id
        ) || original
    );
    setBondedPools(_bondedPools);
  };

  const removeFromBondedPools = (id: number) => {
    const _bondedPools = bondedPools.filter((b: BondedPool) => b.id !== id);
    setBondedPools(_bondedPools);
  };

  // adds a record to bondedPools.
  // currently only used when a new pool is created.
  const addToBondedPools = (pool: BondedPool) => {
    if (!pool) return;

    const exists = bondedPools.find((b: BondedPool) => b.id === pool.id);
    if (!exists) {
      const _bondedPools = bondedPools.concat(pool);
      setBondedPools(_bondedPools);
    }
  };

  return (
    <BondedPoolsContext.Provider
      value={{
        fetchPoolsMetaBatch,
        queryBondedPool,
        getBondedPool,
        updateBondedPools,
        addToBondedPools,
        removeFromBondedPools,
        getPoolNominationStatus,
        getPoolNominationStatusCode,
        poolSearchFilter,
        bondedPools,
        meta: poolMetaBatchesRef.current,
      }}
    >
      {children}
    </BondedPoolsContext.Provider>
  );
};
