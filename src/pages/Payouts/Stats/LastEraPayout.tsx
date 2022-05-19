// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from '../../../contexts/Staking';
import { useApi } from '../../../contexts/Api';
import { Number } from '../../../library/StatBoxList/Number';

export const LastEraPayoutStatBox = () => {
  const { network }: any = useApi();
  const { staking }: any = useStaking();
  const { unit, units } = network;
  const { lastReward } = staking;

  const lastRewardBase = lastReward.div(new BN(10 ** units)).toNumber();

  const params = {
    label: 'Last Era Payout',
    value: lastRewardBase,
    unit,
    assistant: {
      page: 'payouts',
      key: 'Last Era Payout',
    },
  };
  return <Number {...params} />;
};

export default LastEraPayoutStatBox;
