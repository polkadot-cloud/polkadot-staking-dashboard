// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { Number } from 'library/StatBoxList/Number';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';

export const MinJoinBondStat = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { minJoinBond } = useApi().poolsConfig;

  const params = {
    label: t('pools.minimumToJoinPool'),
    value: planckToUnit(minJoinBond, units).toNumber(),
    decimals: 3,
    unit: ` ${unit}`,
    helpKey: 'Minimum To Join Pool',
  };
  return <Number {...params} />;
};
