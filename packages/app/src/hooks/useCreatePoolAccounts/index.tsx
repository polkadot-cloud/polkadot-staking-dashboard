// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { bnToU8a, concatU8a, encodeAddress, stringToU8a } from 'dedot/utils'

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
    const key = concatU8a(
      stringToU8a('modl'),
      poolsPalletId,
      new Uint8Array([index]),
      bnToU8a(BigInt(poolId.toString())),
      new Uint8Array(32)
    )
    return encodeAddress(key.slice(0, 32), ss58Format)
  }
  return createPoolAccounts
}
