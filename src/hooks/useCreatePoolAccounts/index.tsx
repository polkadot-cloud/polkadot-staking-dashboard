// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { bnToU8a, u8aConcat } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { BN } from 'bn.js';
import { EmptyH256, ModPrefix, U32Opts } from 'consts';
import { useApi } from 'contexts/Api';

export const useCreatePoolAccounts = () => {
  const { api, consts } = useApi();
  const { poolsPalletId } = consts;

  // Generates pool stash and reward accounts. Assumes `poolsPalletId` is synced.
  const createPoolAccounts = (poolId: number) => {
    const poolIdBigNumber = new BigNumber(poolId);
    return {
      stash: createAccount(poolIdBigNumber, 0),
      reward: createAccount(poolIdBigNumber, 1),
    };
  };

  const createAccount = (poolId: BigNumber, index: number): string => {
    if (!api) {
      return '';
    }
    return api.registry
      .createType(
        'AccountId32',
        u8aConcat(
          ModPrefix,
          poolsPalletId,
          new Uint8Array([index]),
          bnToU8a(new BN(poolId.toString()), U32Opts),
          EmptyH256
        )
      )
      .toString();
  };

  return createPoolAccounts;
};
