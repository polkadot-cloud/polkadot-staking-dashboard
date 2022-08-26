// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { ImportedAccount } from 'contexts/Connect/types';
import {
  PoolMembership,
  PoolMembershipsContextState,
} from 'contexts/Pools/types';
import { AnyApi, Fn } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import { useApi } from '../../Api';
import { useConnect } from '../../Connect';
import { usePoolsConfig } from '../PoolsConfig';

export const PoolMembershipsContext =
  React.createContext<PoolMembershipsContextState>(
    defaults.defaultPoolMembershipsContext
  );

export const usePoolMemberships = () =>
  React.useContext(PoolMembershipsContext);

export const PoolMembershipsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady } = useApi();
  const { accounts: connectAccounts, activeAccount } = useConnect();
  const { enabled } = usePoolsConfig();

  // stores pool membership
  const [poolMemberships, setPoolMemberships] = useState<Array<PoolMembership>>(
    []
  );
  const poolMembershipsRef = useRef(poolMemberships);

  // stores pool subscription objects
  const [poolMembershipUnsubs, setPoolMembershipUnsubs] = useState<Array<Fn>>(
    []
  );
  const poolMembershipUnsubRefs = useRef<Array<AnyApi>>(poolMembershipUnsubs);

  useEffect(() => {
    if (isReady && enabled) {
      (() => {
        setStateWithRef([], setPoolMemberships, poolMembershipsRef);
        unsubscribeAll();
        getPoolMemberships();
      })();
    }
  }, [network, isReady, connectAccounts, enabled]);

  // subscribe to account pool memberships
  const getPoolMemberships = async () => {
    Promise.all(
      connectAccounts.map((a: ImportedAccount) =>
        subscribeToPoolMembership(a.address)
      )
    );
  };

  // unsubscribe from pool memberships on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, []);

  // unsubscribe from all pool memberships
  const unsubscribeAll = () => {
    Object.values(poolMembershipUnsubRefs.current).forEach((v: Fn) => v());
  };

  // subscribe to an account's pool membership
  const subscribeToPoolMembership = async (address: string) => {
    if (!api) return;

    const unsub = await api.query.nominationPools.poolMembers(
      address,
      async (result: AnyApi) => {
        let membership = result?.unwrapOr(undefined)?.toHuman();

        if (membership) {
          // format pool's unlocking chunks
          const unbondingEras: AnyApi = membership.unbondingEras;
          const unlocking = [];
          for (const [e, v] of Object.entries(unbondingEras || {})) {
            const era = rmCommas(e as string);
            const value = rmCommas(v as string);
            unlocking.push({
              era: Number(era),
              value: new BN(value),
            });
          }
          membership.points = membership.points
            ? rmCommas(membership.points)
            : '0';
          membership = {
            address,
            ...membership,
            unlocking,
          };

          // remove stale membership if it's already in list
          let _poolMemberships = Object.values(poolMembershipsRef.current);
          _poolMemberships = _poolMemberships
            .filter((m: PoolMembership) => m.address !== address)
            .concat(membership);

          setStateWithRef(
            _poolMemberships,
            setPoolMemberships,
            poolMembershipsRef
          );
        } else {
          // no membership: remove account membership if present
          let _poolMemberships = Object.values(poolMembershipsRef.current);
          _poolMemberships = _poolMemberships.filter(
            (m: PoolMembership) => m.address !== address
          );
          setStateWithRef(
            _poolMemberships,
            setPoolMemberships,
            poolMembershipsRef
          );
        }
      }
    );

    const _unsubs = poolMembershipUnsubRefs.current.concat(unsub);
    setStateWithRef(_unsubs, setPoolMembershipUnsubs, poolMembershipUnsubRefs);
    return unsub;
  };

  // gets the membership of the active account
  const getActiveAccountPoolMembership = () => {
    if (!activeAccount) {
      return defaults.poolMembership;
    }
    const poolMembership = poolMembershipsRef.current.find(
      (m: PoolMembership) => m.address === activeAccount
    );
    if (poolMembership === undefined) {
      return defaults.poolMembership;
    }
    return poolMembership;
  };

  return (
    <PoolMembershipsContext.Provider
      value={{
        membership: getActiveAccountPoolMembership(),
        memberships: poolMembershipsRef.current,
      }}
    >
      {children}
    </PoolMembershipsContext.Provider>
  );
};
