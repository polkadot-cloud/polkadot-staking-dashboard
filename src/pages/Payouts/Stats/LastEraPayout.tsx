// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';

export const LastEraPayoutStat = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { staking } = useStaking();
  const { unit, units } = network;
  const { lastReward } = staking;

  const lastRewardUnit = planckToUnit(lastReward, units).toNumber();

  const params = {
    label: t('payouts.lastEraPayout'),
    value: lastRewardUnit,
    unit,
    helpKey: 'Last Era Payout',
  };
  return <Number {...params} />;
};
