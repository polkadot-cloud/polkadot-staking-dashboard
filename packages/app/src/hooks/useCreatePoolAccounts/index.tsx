// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId } from '@polkadot-api/substrate-bindings'
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util'
import BigNumber from 'bignumber.js'
import { BN } from 'bn.js'
import { useApi } from 'contexts/Api'

export const useCreatePoolAccounts = () => {
  const {
    consts,
    chainSpecs: { ss58Format },
  } = useApi()
  const { poolsPalletId } = consts

  // Generates pool stash and reward accounts. Assumes `poolsPalletId` is synced.
  const createPoolAccounts = (poolId: number) => {
    const poolIdBigNumber = new BigNumber(poolId)
    return {
      stash: createAccount(poolIdBigNumber, 0),
      reward: createAccount(poolIdBigNumber, 1),
    }
  }

  const createAccount = (poolId: BigNumber, index: number): string => {
    const key = u8aConcat(
      stringToU8a('modl'),
      poolsPalletId,
      new Uint8Array([index]),
      bnToU8a(new BN(poolId.toString()), { bitLength: 32, isLe: true }),
      new Uint8Array(32)
    )

    const codec = AccountId(ss58Format)
    return codec.dec(key)
  }

  return createPoolAccounts
}
