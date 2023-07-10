// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { pageFromUri } from '@polkadotcloud/utils';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { useLocation } from 'react-router-dom';
import { Connect } from './Connect';
import { Connected } from './Connected';
import { SideMenuToggle } from './SideMenuToggle';
import { Spinner } from './Spinner';
import { LargeScreensOnly, Wrapper } from './Wrappers';

export const Headers = () => {
  const { pathname } = useLocation();
  const { validators } = useValidators();
  const { bondedPools } = useBondedPools();
  const { poolMembers } = usePoolMembers();
  const { pending } = useExtrinsics();
  const { isSyncing } = useUi();

  // keep syncing if on validators page and still fetching
  const onValidatorsSyncing = () => {
    if (pageFromUri(pathname, 'overview') === 'validators') {
      if (!validators.length) {
        return true;
      }
    }
    return false;
  };

  // keep syncing if on pools page and still fetching bonded pools or pool members
  const onPoolsSyncing = () => {
    // TODO: if subscan is being used for pool members, do not factor `poolMembers` in this
    // conditional.
    if (pageFromUri(pathname, 'overview') === 'pools') {
      if (!bondedPools.length || !poolMembers.length) {
        return true;
      }
    }
    return false;
  };

  const syncing = isSyncing || onValidatorsSyncing() || onPoolsSyncing();

  return (
    <>
      <Wrapper>
        {/* side menu toggle: shows on small screens */}
        <SideMenuToggle />

        {/* spinner to show app syncing */}
        {syncing || pending.length > 0 ? <Spinner /> : null}

        {/* connected accounts */}
        <LargeScreensOnly>
          <Connected />
        </LargeScreensOnly>

        {/* connect button */}
        <Connect />
      </Wrapper>
    </>
  );
};
