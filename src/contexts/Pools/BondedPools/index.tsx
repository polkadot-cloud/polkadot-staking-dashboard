// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { bnToU8a, u8aConcat } from '@polkadot/util';
import {
  BondedPool,
  BondedPoolsContextState,
  MaybePool,
  NominationStatuses,
} from 'contexts/Pools/types';
import { EMPTY_H256, MOD_PREFIX, U32_OPTS } from 'consts';
import { AnyApi, AnyMetaBatch, Fn, MaybeAccount } from 'types';
import { setStateWithRef } from 'Utils';
import { useStaking } from 'contexts/Staking';
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
  const { api, network, isReady, consts } = useApi();
  const { enabled } = usePoolsConfig();
  const { getNominationsStatusFromTargets } = useStaking();
  const { poolsPalletId } = consts;

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
  }, [network, isReady, enabled]);

  // after bonded pools have synced, fetch metabatch
  useEffect(() => {
    if (bondedPools.length) {
      fetchPoolsMetaBatch('bonded_pools', bondedPools, false);
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
    // humanise exposures to send to worker
    const exposures = _exposures.map(([_keys, _val]: AnyApi) => {
      const id = _keys.toHuman()[0];
      const pool = _val.toHuman();
      return getPoolWithAddresses(id, pool);
    });

    setBondedPools(exposures);
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
      return {};
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

  // Helper: generates pool stash and reward accounts. assumes poolsPalletId is synced.
  const createAccounts = (poolId: number) => {
    const poolIdBN = new BN(poolId);
    return {
      stash: createAccount(poolIdBN, 0),
      reward: createAccount(poolIdBN, 1),
    };
  };

  const createAccount = (poolId: BN, index: number): string => {
    if (!api) return '';
    return api.registry
      .createType(
        'AccountId32',
        u8aConcat(
          MOD_PREFIX,
          poolsPalletId,
          new Uint8Array([index]),
          bnToU8a(poolId, U32_OPTS),
          EMPTY_H256
        )
      )
      .toString();
  };

  const getBondedPool = (poolId: MaybePool) => {
    const pool = bondedPools.find((p: BondedPool) => p.id === poolId) ?? null;
    return pool;
  };

  return (
    <BondedPoolsContext.Provider
      value={{
        fetchPoolsMetaBatch,
        createAccounts,
        getBondedPool,
        getPoolNominationStatus,
        getPoolNominationStatusCode,
        bondedPools,
        meta: poolMetaBatchesRef.current,
      }}
    >
      {children}
    </BondedPoolsContext.Provider>
  );
};
