// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { faUserPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useUi } from 'contexts/UI';
import { usePoolsTabs } from '../context';

export const useStatusButtons = () => {
  const { isReady } = useApi();
  const { setOnPoolSetup, getPoolSetupProgressPercent } = useUi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { membership } = usePoolMemberships();
  const { setActiveTab } = usePoolsTabs();
  const { isOwner, getPoolBondOptions } = useActivePool();
  const { active } = getPoolBondOptions(activeAccount);
  const poolSetupPercent = getPoolSetupProgressPercent(activeAccount);

  let _label;
  let _buttons;

  const createBtn = {
    title: `Create Pool${poolSetupPercent > 0 ? `: ${poolSetupPercent}%` : ``}`,
    icon: faPlusCircle,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount) || !activeAccount,
    onClick: () => setOnPoolSetup(1),
  };

  const joinPoolBtn = {
    title: `Join Pool`,
    icon: faUserPlus,
    transform: 'grow-1',
    disabled: !isReady || isReadOnlyAccount(activeAccount) || !activeAccount,
    onClick: () => setActiveTab(2),
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
