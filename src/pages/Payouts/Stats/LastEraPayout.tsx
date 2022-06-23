// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import { Number } from 'library/StatBoxList/Number';
import { APIContextInterface } from 'types/api';
import { StakingContextInterface } from 'types/staking';

export const LastEraPayoutStatBox = () => {
  const { network } = useApi() as APIContextInterface;
  const { staking } = useStaking() as StakingContextInterface;
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
