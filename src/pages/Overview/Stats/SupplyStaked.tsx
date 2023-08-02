// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';

export const SupplyStakedStat = () => {
  const { t } = useTranslation('pages');
  const { units, unit } = useApi().network;
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
