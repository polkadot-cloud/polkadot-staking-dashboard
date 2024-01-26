// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { Number } from 'library/StatBoxList/Number';
import { useApi } from 'contexts/Api';

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
