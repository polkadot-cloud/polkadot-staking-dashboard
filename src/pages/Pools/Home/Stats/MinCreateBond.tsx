// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@polkadotcloud/utils';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { Number } from 'library/StatBoxList/Number';

export const MinCreateBondStat = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { units } = network;
  const { stats } = usePoolsConfig();

  const params = {
    label: t('pools.minimumToCreatePool'),
    value: planckToUnit(stats.minCreateBond, units).toNumber(),
    decimals: 3,
    unit: network.unit,
    helpKey: 'Minimum To Create Pool',
  };
  return <Number {...params} />;
};
