// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { Number } from 'library/StatBoxList/Number';
import { useNetwork } from 'contexts/Network';

export const MinimumActiveStakeStat = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: { unit, units },
  } = useNetwork();
  const { metrics } = useNetworkMetrics();
  const { minimumActiveStake } = metrics;

  const params = {
    label: t('nominate.minimumToEarnRewards'),
    value: planckToUnit(minimumActiveStake, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};
