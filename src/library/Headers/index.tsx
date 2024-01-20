// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageFromUri } from '@polkadot-cloud/utils';
import { useLocation } from 'react-router-dom';
import { usePlugins } from 'contexts/Plugins';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { usePayouts } from 'contexts/Payouts';
import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';
import { Spinner } from './Spinner';
import { LargeScreensOnly, Wrapper } from './Wrappers';
import { useTxMeta } from 'contexts/TxMeta';

export const Headers = () => {
  const { isSyncing } = useUi();
  const { pathname } = useLocation();
  const { pendingNonces } = useTxMeta();
  const { payoutsSynced } = usePayouts();
  const { pluginEnabled } = usePlugins();
  const { validators } = useValidators();
  const { bondedPools } = useBondedPools();
  const { poolMembersNode } = usePoolMembers();

  // Keep syncing if on nominate page and still fetching payouts.
  const onNominateSyncing = () => {
    if (pageFromUri(pathname, 'overview') === 'nominate') {
      if (payoutsSynced !== 'synced') {
        return true;
      }
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
    if (pageFromUri(pathname, 'overview') === 'validators') {
      if (!validators.length) {
        return true;
      }
    }

    return false;
  };

  const syncing =
    isSyncing ||
    onNominateSyncing() ||
    onValidatorsSyncing() ||
    onPoolsSyncing();

  return (
    <Wrapper>
      {/* side menu toggle: shows on small screens */}
      <SideMenuToggle />

      {/* spinner to show app syncing */}
      {syncing || pendingNonces.length > 0 ? <Spinner /> : null}

      {/* connected accounts */}
      <LargeScreensOnly>
        <Connected />
      </LargeScreensOnly>

      {/* connect button */}
      <Connect />
    </Wrapper>
  );
};
