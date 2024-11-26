// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageFromUri } from '@w3ux/utils';
import { usePayouts } from 'contexts/Payouts';
import { usePlugins } from 'contexts/Plugins';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTxMeta } from 'contexts/TxMeta';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useSyncing } from 'hooks/useSyncing';
import { useLocation } from 'react-router-dom';
import { Spinner } from './Spinner';

export const Sync = () => {
  const { syncing } = useSyncing();
  const { pathname } = useLocation();
  const { pendingNonces } = useTxMeta();
  const { payoutsSynced } = usePayouts();
  const { pluginEnabled } = usePlugins();
  const { validators } = useValidators();
  const { bondedPools } = useBondedPools();
  const { poolMembersNode } = usePoolMembers();

  // Keep syncing if on nominate page and still fetching payouts.
  const onNominateSyncing = () => {
    if (
      pageFromUri(pathname, 'overview') === 'nominate' &&
      payoutsSynced !== 'synced'
    ) {
      return true;
    }
    return false;
  };

  // Keep syncing if on pools page and still fetching bonded pools or pool members. Ignore pool
  // member sync if Subscan is enabled.
  const onPoolsSyncing = () => {
    if (pageFromUri(pathname, 'overview') === 'pools') {
      if (
        !bondedPools.length ||
        (!poolMembersNode.length && !pluginEnabled('subscan'))
      ) {
        return true;
      }
    }
    return false;
  };

  // Keep syncing if on validators page and still fetching.
  const onValidatorsSyncing = () => {
    if (
      pageFromUri(pathname, 'overview') === 'validators' &&
      !validators.length
    ) {
      return true;
    }
    return false;
  };

  const isSyncing =
    syncing ||
    onPoolsSyncing() ||
    onNominateSyncing() ||
    onValidatorsSyncing() ||
    pendingNonces.length > 0;

  return isSyncing ? <Spinner /> : null;
};
