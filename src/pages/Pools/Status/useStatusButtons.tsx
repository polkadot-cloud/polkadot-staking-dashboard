// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolState } from 'contexts/Pools/types';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useModal } from 'contexts/Modal';
import {
  faSignOutAlt,
  faTimesCircle,
  faLock,
  faUserPlus,
  faPlusCircle,
  faLockOpen,
} from '@fortawesome/free-solid-svg-icons';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { usePoolsTabs } from '../context';

export const useStatusButtons = () => {
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { membership } = usePoolMemberships();
  const { setActiveTab } = usePoolsTabs();
  const { activeBondedPool, isOwner, getPoolBondOptions } = useActivePool();
  const { openModalWith } = useModal();
  const { active } = getPoolBondOptions(activeAccount);

  let _label;
  let _buttons;

  const createBtn = {
    title: 'Create Pool',
    icon: faPlusCircle,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount) || !activeAccount,
    onClick: () => openModalWith('CreatePool', { bondType: 'pool' }, 'small'),
  };

  const joinPoolBtn = {
    title: 'Join Pool',
    icon: faUserPlus,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount) || !activeAccount,
    onClick: () => setActiveTab(1),
  };

  const leaveBtn = {
    title: 'Leave Pool',
    icon: faSignOutAlt,
    disabled: !isReady || isReadOnlyAccount(activeAccount),
    small: true,
    onClick: () => openModalWith('LeavePool', { bondType: 'pool' }, 'small'),
  };

  const destroyBtn = {
    title: 'Destroy',
    icon: faTimesCircle,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount),
    small: true,
    onClick: () =>
      openModalWith(
        'ChangePoolState',
        { bondType: 'pool', state: PoolState.Destroy },
        'small'
      ),
  };

  const blockBtn = {
    title: 'Lock',
    icon: faLock,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount),
    small: true,
    onClick: () =>
      openModalWith(
        'ChangePoolState',
        { bondType: 'pool', state: PoolState.Block },
        'small'
      ),
  };

  const openBtn = {
    title: 'Unlock',
    icon: faLockOpen,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount),
    small: true,
    onClick: () =>
      openModalWith(
        'ChangePoolState',
        { bondType: 'pool', state: PoolState.Open },
        'small'
      ),
  };

  if (!membership) {
    _label = 'Not in a Pool';
    _buttons = [createBtn, joinPoolBtn];
  } else if (isOwner()) {
    _label = `Owner of Pool ${membership.poolId}`;
    switch (activeBondedPool?.state) {
      case PoolState.Open:
        _buttons = [destroyBtn, blockBtn];
        break;
      case PoolState.Block:
        _buttons = [destroyBtn, openBtn];
        break;
      default:
        _buttons = [];
    }
  } else if (active?.gtn(0)) {
    _label = `Active in Pool ${membership.poolId}`;
    _buttons = [leaveBtn];
  } else {
    _label = `Leaving Pool ${membership.poolId}`;
  }
  return { label: _label, buttons: _buttons };
};
