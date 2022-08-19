// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useModal } from 'contexts/Modal';
import { faUserPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { usePoolsTabs } from '../context';

export const useStatusButtons = () => {
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { membership } = usePoolMemberships();
  const { setActiveTab } = usePoolsTabs();
  const { isOwner, getPoolBondOptions } = useActivePool();
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

  if (!membership) {
    _label = 'Pool Membership';
    _buttons = [createBtn, joinPoolBtn];
  } else if (isOwner()) {
    _label = `Owner of Pool ${membership.poolId}`;
  } else if (active?.gtn(0)) {
    _label = `Member of Pool ${membership.poolId}`;
  } else {
    _label = `Leaving Pool ${membership.poolId}`;
  }
  return { label: _label, buttons: _buttons };
};
