// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';

export const ActivePoolsStat = () => {
  const { t } = useTranslation('pages');
  const { counterForBondedPools } = useApi().poolsConfig;

  const params = {
    label: t('pools.activePools'),
    value: counterForBondedPools.toNumber(),
    unit: '',
    helpKey: 'Active Pools',
  };
  return <Number {...params} />;
};
