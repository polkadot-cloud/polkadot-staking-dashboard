// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import { Number } from 'library/StatBoxList/Number';
import { planckBnToUnit } from 'Utils';
import { useTranslation } from 'react-i18next';

export const LastEraPayoutStatBox = () => {
  const { network } = useApi();
  const { staking } = useStaking();
  const { unit, units } = network;
  const { lastReward } = staking;
  const { t } = useTranslation('common');

  const lastRewardBase = planckBnToUnit(lastReward, units).toFixed(0);

  const params = {
    label: t('pages.payouts.last_era_payout'),
    value: lastRewardBase,
    unit,
    helpKey: 'Last Era Payout',
  };
  return <Number {...params} />;
};

export default LastEraPayoutStatBox;
