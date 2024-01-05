// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  ClaimPermissionConfig,
  PoolMembership,
  PoolMembershipsContextState,
} from './types';
import type { AnyApi, Fn } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useApi } from '../../Api';
import * as defaults from './defaults';

export const PoolMembershipsContext =
  createContext<PoolMembershipsContextState>(
    defaults.defaultPoolMembershipsContext
  );

export const usePoolMemberships = () => useContext(PoolMembershipsContext);

export const PoolMembershipsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { t } = useTranslation('base');
  const { network } = useNetwork();
  const { api, isReady } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { accounts: connectAccounts } = useImportedAccounts();

  // Stores pool memberships for the imported accounts.
  const [poolMemberships, setPoolMemberships] = useState<PoolMembership[]>([]);
  const poolMembershipsRef = useRef(poolMemberships);

  // Stores pool membership unsubs.
  const unsubs = useRef<AnyApi[]>([]);

  useEffectIgnoreInitial(() => {
    if (isReady) {
      (() => {
        setStateWithRef([], setPoolMemberships, poolMembershipsRef);
        unsubAll();
        getPoolMemberships();
      })();
    }
  }, [network, isReady, connectAccounts]);

  // subscribe to account pool memberships
  const getPoolMemberships = async () => {
    Promise.all(
      connectAccounts.map(({ address }) => subscribeToPoolMembership(address))
    );
  };

  // unsubscribe from pool memberships on unmount
  useEffect(
    () => () => {
      unsubAll();
    },
    []
  );

  // unsubscribe from all pool memberships
  const unsubAll = () => {
    Object.values(unsubs.current).forEach((v: Fn) => v());
  };

  // subscribe to an account's pool membership
  const subscribeToPoolMembership = async (address: string) => {
    if (!api) {
      return undefined;
    }

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.nominationPools.poolMembers, address],
        [api.query.nominationPools.claimPermissions, address],
      ],
      ([poolMember, claimPermission]) => {
        handleMembership(poolMember, claimPermission);
      }
    );

    const handleMembership = async (
      poolMember: AnyApi,
      claimPermission?: AnyApi
    ) => {
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

        const balance =
          (
            await api.call.nominationPoolsApi.pointsToBalance(
              membership.poolId,
              membership.points
            )
          )?.toString() || '0';

        membership = {
          ...membership,
          balance: new BigNumber(balance),
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

    unsubs.current = unsubs.current.concat(unsub);
    return unsub;
  };

  // gets the membership of the active account
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
        membership: getActiveAccountPoolMembership(),
        memberships: poolMembershipsRef.current,
        claimPermissionConfig,
      }}
    >
      {children}
    </PoolMembershipsContext.Provider>
  );
};
