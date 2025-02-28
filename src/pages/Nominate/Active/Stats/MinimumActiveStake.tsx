// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import { Number } from 'library/StatBoxList/Number';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';

export const MinimumActiveStakeStat = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: { unit, units },
  } = useNetwork();
  const { minimumActiveStake } = useApi().networkMetrics;

  const params = {
    label: t('nominate.minimumToEarnRewards'),
    value: planckToUnit(minimumActiveStake, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};
