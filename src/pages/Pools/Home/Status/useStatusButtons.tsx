// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlusCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTranslation } from 'react-i18next';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { usePoolsTabs } from '../context';

export const useStatusButtons = () => {
  const { isReady } = useApi();
  const { setOnPoolSetup, getPoolSetupProgressPercent } = useUi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { stats } = usePoolsConfig();
  const { membership } = usePoolMemberships();
  const { setActiveTab } = usePoolsTabs();
  const { bondedPools } = useBondedPools();
  const { isOwner } = useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { t } = useTranslation('common');

  const { active } = getTransferOptions(activeAccount).pool;
  const poolSetupPercent = getPoolSetupProgressPercent(activeAccount);

  let _label;
  let _buttons;
  const createBtn = {
    title: `${t('pages.pools.create_pool')}${
      poolSetupPercent > 0 ? `: ${poolSetupPercent}%` : ``
    }`,
    icon: faPlusCircle,
    transform: 'grow-1',
    disabled:
      !isReady ||
      isReadOnlyAccount(activeAccount) ||
      !activeAccount ||
      stats.maxPools.toNumber() === 0 ||
      bondedPools.length === stats.maxPools.toNumber(),
    onClick: () => setOnPoolSetup(1),
  };

  const joinPoolBtn = {
    title: `${t('pages.pools.join_pool')}`,
    icon: faUserPlus,
    transform: 'grow-1',
    disabled:
      !isReady ||
      isReadOnlyAccount(activeAccount) ||
      !activeAccount ||
      !bondedPools.length,
    onClick: () => setActiveTab(2),
  };

  if (!membership) {
    _label = t('pages.pools.pool_membership');
    _buttons = [createBtn, joinPoolBtn];
  } else if (isOwner()) {
    _label = `${t('pages.pools.owner_of_pool')} ${membership.poolId}`;
  } else if (active?.gtn(0)) {
    _label = `${t('pages.pools.member_of_pool')} ${membership.poolId}`;
  } else {
    _label = `${t('pages.pools.leaving_pool')} ${membership.poolId}`;
  }
  return { label: _label, buttons: _buttons };
};
