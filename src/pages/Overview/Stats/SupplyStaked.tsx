// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { planckBnToUnit, toFixedIfNecessary } from 'Utils';

export const SupplyStakedStatBox = () => {
  const { units, unit } = useApi().network;
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();

  const { lastTotalStake } = staking;
  const { totalIssuance } = metrics;

  // total supply as percent
  const totalIssuanceBase = planckBnToUnit(totalIssuance, units);
  const lastTotalStakeBase = planckBnToUnit(lastTotalStake, units);
  const supplyAsPercent =
    lastTotalStakeBase === 0
      ? 0
      : lastTotalStakeBase / (totalIssuanceBase * 0.01);

  const params = {
    label: `${unit} Supply Staked`,
    stat: {
      value: toFixedIfNecessary(supplyAsPercent, 2),
      unit: '%',
    },
    graph: {
      value1: supplyAsPercent,
      value2: 100 - supplyAsPercent,
    },
    tooltip: `${toFixedIfNecessary(supplyAsPercent, 2)}%`,
    helpKey: 'Supply Staked',
  };

  return <Pie {...params} />;
};

export default SupplyStakedStatBox;
