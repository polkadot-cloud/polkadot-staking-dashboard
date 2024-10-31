// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { Number } from 'library/StatBoxList/Number';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { planckToUnitBn } from 'Utils';

export const LastEraPayoutStat = () => {
  const { t } = useTranslation('pages');
  const { unit, units } = useNetwork().networkData;
  const { lastReward } = useApi().stakingMetrics;

  const lastRewardUnit = planckToUnitBn(lastReward, units).toNumber();

  const params = {
    label: t('payouts.lastEraPayout'),
    value: lastRewardUnit,
    decimals: 3,
    unit,
    helpKey: 'Last Era Payout',
  };
  return <Number {...params} />;
};
