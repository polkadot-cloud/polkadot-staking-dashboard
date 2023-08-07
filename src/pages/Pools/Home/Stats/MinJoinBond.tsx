// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@polkadotcloud/utils';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { Number } from 'library/StatBoxList/Number';

export const MinJoinBondStat = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { units } = network;
  const { stats } = usePoolsConfig();

  const params = {
    label: t('pools.minimumToJoinPool'),
    value: planckToUnit(stats.minJoinBond, units).toNumber(),
    decimals: 3,
    unit: ` ${network.unit}`,
    helpKey: 'Minimum To Join Pool',
  };
  return <Number {...params} />;
};
