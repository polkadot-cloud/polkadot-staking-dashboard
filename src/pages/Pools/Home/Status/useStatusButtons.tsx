// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlusCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useSetup } from 'contexts/Setup';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { usePoolsTabs } from '../context';

export const useStatusButtons = () => {
  const { t } = useTranslation('pages');
  const { isReady, network } = useApi();
  const { setOnPoolSetup, getPoolSetupPercent } = useSetup();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { stats } = usePoolsConfig();
  const { membership } = usePoolMemberships();
  const { setActiveTab } = usePoolsTabs();
  const { bondedPools } = useBondedPools();
  const { isOwner } = useActivePools();
  const { getTransferOptions } = useTransferOptions();

  const { active } = getTransferOptions(activeAccount).pool;
  const poolSetupPercent = getPoolSetupPercent(activeAccount);

  let _label;
  let _buttons;
  const createBtn = {
    title: `${t('pools.create')}${
      poolSetupPercent > 0 ? `: ${poolSetupPercent}%` : ``
    }`,
    icon: faPlusCircle,
    large: false,
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
      setOnPoolSetup(true);
    },
  };

  const joinPoolBtn = {
    title: `${t('pools.join')}`,
    icon: faUserPlus,
    large: false,
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
    _label = t('pools.poolMembership');
    _buttons = [createBtn, joinPoolBtn];
  } else if (isOwner()) {
    _label = `${t('pools.ownerOfPool')} ${membership.poolId}`;
  } else if (active?.isGreaterThan(0)) {
    _label = `${t('pools.memberOfPool')} ${membership.poolId}`;
  } else {
    _label = `${t('pools.leavingPool')} ${membership.poolId}`;
  }
  return { label: _label, buttons: _buttons };
};
