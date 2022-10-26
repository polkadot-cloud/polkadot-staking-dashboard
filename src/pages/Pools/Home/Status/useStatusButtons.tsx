// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlusCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { registerSaEvent } from 'Utils';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { usePoolsTabs } from '../context';

export const useStatusButtons = () => {
  const { isReady, network } = useApi();
  const { setOnPoolSetup, getPoolSetupProgressPercent } = useUi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { stats } = usePoolsConfig();
  const { membership } = usePoolMemberships();
  const { setActiveTab } = usePoolsTabs();
  const { bondedPools } = useBondedPools();
  const { isOwner } = useActivePools();
  const { getTransferOptions } = useTransferOptions();

  const { active } = getTransferOptions(activeAccount).pool;
  const poolSetupPercent = getPoolSetupProgressPercent(activeAccount);

  let _label;
  let _buttons;
  const createBtn = {
    title: `Create${poolSetupPercent > 0 ? `: ${poolSetupPercent}%` : ``}`,
    icon: faPlusCircle,
    transform: 'grow-1',
    disabled:
      !isReady ||
      isReadOnlyAccount(activeAccount) ||
      !activeAccount ||
      stats.maxPools.toNumber() === 0 ||
      bondedPools.length === stats.maxPools.toNumber(),
    onClick: () => {
      registerSaEvent(
        `${network.name.toLowerCase()}_pool_create_button_pressed`
      );
      setOnPoolSetup(1);
    },
  };

  const joinPoolBtn = {
    title: `Join`,
    icon: faUserPlus,
    transform: 'grow-1',
    disabled:
      !isReady ||
      isReadOnlyAccount(activeAccount) ||
      !activeAccount ||
      !bondedPools.length,
    onClick: () => {
      registerSaEvent(`${network.name.toLowerCase()}_pool_join_button_pressed`);
      setActiveTab(2);
    },
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
