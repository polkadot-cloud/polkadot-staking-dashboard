// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';

export const LastEraPayoutStatBox = () => {
  const { network } = useApi();
  const { staking } = useStaking();
  const { unit, units } = network;
  const { lastReward } = staking;
  const { t } = useTranslation('pages');

  const lastRewardBase = planckBnToUnit(lastReward, units).toFixed(0);

  const params = {
    label: t('payouts.last_era_payout'),
    value: lastRewardBase,
    unit,
    helpKey: 'Last Era Payout',
  };
  return <Number {...params} />;
};

export default LastEraPayoutStatBox;
