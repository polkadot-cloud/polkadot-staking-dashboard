// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlusCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('pages');

  const { active } = getTransferOptions(activeAccount).pool;
  const poolSetupPercent = getPoolSetupProgressPercent(activeAccount);

  let _label;
  let _buttons;
  const createBtn = {
    title: `${t('pools.create')}${
      poolSetupPercent > 0 ? `: ${poolSetupPercent}%` : ``
    }`,
    icon: faPlusCircle,
    large: true,
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
    title: `${t('pools.join')}`,
    icon: faUserPlus,
    large: true,
    transform: 'grow-1',
    disabled:
      !isReady ||
      isReadOnlyAccount(activeAccount) ||
      !activeAccount ||
      !bondedPools.length,
    onClick: () => setActiveTab(2),
  };

  if (!membership) {
    _label = t('pools.poolMembership');
    _buttons = [createBtn, joinPoolBtn];
  } else if (isOwner()) {
    _label = `${t('pools.ownerOfPool')} ${membership.poolId}`;
  } else if (active?.gtn(0)) {
    _label = `${t('pools.memberOfPool')} ${membership.poolId}`;
  } else {
    _label = `${t('pools.leavingPool')} ${membership.poolId}`;
  }
  return { label: _label, buttons: _buttons };
};
