// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rmCommas, setStateWithRef } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import type {
  ClaimPermissionConfig,
  PoolMembership,
  PoolMembershipsContextState,
} from 'contexts/Pools/types';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyApi, Fn, MaybeAccount } from 'types';
import { useApi } from '../../Api';
import { useConnect } from '../../Connect';
import * as defaults from './defaults';

export const PoolMembershipsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { t } = useTranslation('base');
  const { api, network, isReady } = useApi();
  const { accounts: connectAccounts, activeAccount } = useConnect();

  // stores pool membership
  const [poolMemberships, setPoolMemberships] = useState<PoolMembership[]>([]);
  const poolMembershipsRef = useRef(poolMemberships);

  // stores pool subscription objects
  const poolMembershipUnsubs = useRef<AnyApi[]>([]);

  useEffect(() => {
    if (isReady) {
      (() => {
        setStateWithRef([], setPoolMemberships, poolMembershipsRef);
        unsubscribeAll();
        getPoolMemberships();
      })();
    }
  }, [network, isReady, connectAccounts]);

  // subscribe to account pool memberships
  const getPoolMemberships = async () => {
    Promise.all(
      connectAccounts.map((a) => subscribeToPoolMembership(a.address))
    );
  };

  // unsubscribe from pool memberships on unmount
  useEffect(
    () => () => {
      unsubscribeAll();
    },
    []
  );

  // unsubscribe from all pool memberships
  const unsubscribeAll = () => {
    Object.values(poolMembershipUnsubs.current).forEach((v: Fn) => v());
  };

  // subscribe to an account's pool membership
  const subscribeToPoolMembership = async (address: string) => {
    if (!api) return;

    // Westend only: include claimPermissions.
    let unsub;
    if (network.name === 'westend') {
      unsub = await api.queryMulti<AnyApi>(
        [
          [api.query.nominationPools.poolMembers, address],
          [api.query.nominationPools.claimPermissions, address],
        ],
        ([poolMember, claimPermission]) => {
          handleMembership(poolMember, claimPermission);
        }
      );
    } else {
      unsub = await api.query.nominationPools.poolMembers(
        address,
        (poolMember: AnyApi) => {
          handleMembership(poolMember, undefined);
        }
      );
    }

    const handleMembership = (poolMember: AnyApi, claimPermission?: AnyApi) => {
      let membership = poolMember?.unwrapOr(undefined)?.toHuman();

      if (membership) {
        // format pool's unlocking chunks
        const unbondingEras: AnyApi = membership.unbondingEras;
        const unlocking = [];
        for (const [e, v] of Object.entries(unbondingEras || {})) {
          unlocking.push({
            era: Number(rmCommas(e as string)),
            value: new BigNumber(rmCommas(v as string)),
          });
        }
        membership.points = membership.points
          ? rmCommas(membership.points)
          : '0';
        membership = {
          ...membership,
          address,
          unlocking,
          claimPermission: claimPermission?.toString() || 'Permissioned',
        };

        // remove stale membership if it's already in list, and add to memberships.
        setStateWithRef(
          Object.values(poolMembershipsRef.current)
            .filter((m) => m.address !== address)
            .concat(membership),
          setPoolMemberships,
          poolMembershipsRef
        );
      } else {
        // no membership: remove account membership if present.
        setStateWithRef(
          Object.values(poolMembershipsRef.current).filter(
            (m) => m.address !== address
          ),
          setPoolMemberships,
          poolMembershipsRef
        );
      }
    };

    poolMembershipUnsubs.current = poolMembershipUnsubs.current.concat(unsub);
    return unsub;
  };

  // gets the membership of the active account.
  const getActiveAccountPoolMembership = () => {
    if (!activeAccount) {
      return defaults.poolMembership;
    }
    const poolMembership = poolMembershipsRef.current.find(
      (m) => m.address === activeAccount
    );
    if (poolMembership === undefined) {
      return defaults.poolMembership;
    }
    return poolMembership;
  };

  // gets the membership of the account.
  const getAccountPoolMembership = (address: MaybeAccount) => {
    if (!address) {
      return defaults.poolMembership;
    }
    const poolMembership = poolMembershipsRef.current.find(
      (m) => m.address === address
    );
    if (poolMembership === undefined) {
      return defaults.poolMembership;
    }
    return poolMembership;
  };

  const claimPermissionConfig: ClaimPermissionConfig[] = [
    {
      label: t('allowCompound'),
      value: 'PermissionlessCompound',
      description: t('allowAnyoneCompound'),
    },
    {
      label: t('allowWithdraw'),
      value: 'PermissionlessWithdraw',
      description: t('allowAnyoneWithdraw'),
    },
    {
      label: t('allowAll'),
      value: 'PermissionlessAll',
      description: t('allowAnyoneCompoundWithdraw'),
    },
  ];

  return (
    <PoolMembershipsContext.Provider
      value={{
        activeAccountMembership: getActiveAccountPoolMembership,
        accountMembership: getAccountPoolMembership,
        memberships: poolMembershipsRef.current,
        claimPermissionConfig,
      }}
    >
      {children}
    </PoolMembershipsContext.Provider>
  );
};

export const PoolMembershipsContext =
  React.createContext<PoolMembershipsContextState>(
    defaults.defaultPoolMembershipsContext
  );

export const usePoolMemberships = () =>
  React.useContext(PoolMembershipsContext);
