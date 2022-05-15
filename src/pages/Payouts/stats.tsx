// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from '../../contexts/Staking';
import { useApi } from '../../contexts/Api';

export const useStats = () => {
  const { network }: any = useApi();
  const { staking }: any = useStaking();
  const { unit, units } = network;
  const { lastReward } = staking;

  let lastRewardBase = lastReward.div(new BN(10 ** units)).toNumber();

  return [
    {
      format: 'number',
      params: {
        label: 'Last Era Payout',
        value: lastRewardBase,
        unit: unit,
        assistant: {
          page: 'payouts',
          key: 'Last Era Payout',
        },
      },
    },
  ];
}