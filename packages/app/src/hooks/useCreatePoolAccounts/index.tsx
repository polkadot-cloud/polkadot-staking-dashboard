// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { bnToU8a } from '@polkadot/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { concatU8a, encodeAddress, stringToU8a } from 'dedot/utils'

export const useCreatePoolAccounts = () => {
  const { network } = useNetwork()
  const { getChainSpec, consts } = useApi()

  const { poolsPalletId } = consts
  const { ss58Format } = getChainSpec(network).properties

  // Generates pool stash and reward accounts. Assumes `poolsPalletId` is synced.
  const createPoolAccounts = (poolId: number) => ({
    stash: createAccount(Number(poolId), 0),
    reward: createAccount(Number(poolId), 1),
  })

  const createAccount = (poolId: number, index: number): string => {
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
