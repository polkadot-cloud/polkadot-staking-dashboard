// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useNetwork } from 'contexts/Network';

export const SupplyStakedStat = () => {
  const { t } = useTranslation('pages');
  const { units, unit } = useNetwork().networkData;
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();

  const { lastTotalStake } = staking;
  const { totalIssuance } = metrics;

  // total supply as percent.
  const totalIssuanceUnit = planckToUnit(totalIssuance, units);
  const lastTotalStakeUnit = planckToUnit(lastTotalStake, units);
  const supplyAsPercent =
    lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero()
      ? new BigNumber(0)
      : lastTotalStakeUnit.dividedBy(totalIssuanceUnit.multipliedBy(0.01));

  const params = {
    label: t('overview.unitSupplyStaked', { unit }),
    stat: {
      value: `${supplyAsPercent.decimalPlaces(2).toFormat()}`,
      unit: '%',
    },
    graph: {
      value1: supplyAsPercent.decimalPlaces(2).toNumber(),
      value2: new BigNumber(100)
        .minus(supplyAsPercent)
        .decimalPlaces(2)
        .toNumber(),
    },
    tooltip: `${supplyAsPercent.decimalPlaces(2).toFormat()}%`,
    helpKey: 'Supply Staked',
  };

  return <Pie {...params} />;
};
