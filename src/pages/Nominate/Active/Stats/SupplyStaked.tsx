// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { Pie } from 'library/StatBoxList/Pie';
import { toFixedIfNecessary } from 'Utils';
import { useTranslation } from 'react-i18next';

export const SupplyStakedStatBox = () => {
  const { network } = useApi();
  const { units } = network;
  const { metrics } = useNetworkMetrics();
  const { totalIssuance } = metrics;
  const { staking } = useStaking();
  const { t } = useTranslation('common');

  const { lastTotalStake } = staking;

  // total supply as percent
  let supplyAsPercent = 0;
  if (totalIssuance.gt(new BN(0))) {
    supplyAsPercent = lastTotalStake
      .div(totalIssuance.div(new BN(100)))
      .toNumber();
  }

  // base values
  const lastTotalStakeBase = lastTotalStake.div(new BN(10 ** units));
  const totalIssuanceBase = totalIssuance.div(new BN(10 ** units));

  const params = {
    label: t('pages.nominate.total_supply_staked'),
    stat: {
      value: lastTotalStakeBase.toNumber(),
      unit: network.unit,
    },
    graph: {
      value1: lastTotalStakeBase.toNumber(),
      value2: totalIssuanceBase.sub(lastTotalStakeBase).toNumber(),
    },

    tooltip: `${toFixedIfNecessary(supplyAsPercent, 2)}%`,
    helpKey: 'Supply Staked',
  };

  return <Pie {...params} />;
};

export default SupplyStakedStatBox;
