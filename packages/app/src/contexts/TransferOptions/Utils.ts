// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { NetworkId } from 'types'

// Get the local storage record for an account reserve balance
export const getLocalFeeReserve = (
  address: MaybeString,
  defaultReserve: bigint,
  { network }: { network: NetworkId; units: number }
): bigint => {
  const reserves = JSON.parse(localStorage.getItem('reserve_balances') ?? '{}')
  return BigInt(reserves?.[network]?.[address || ''] || defaultReserve)
}

// Sets the local storage record fro an account reserve balance
export const setLocalFeeReserve = (
  address: MaybeString,
  amount: bigint,
  network: NetworkId
): void => {
  if (!address) {
    return
  }
  try {
    const newReserves = JSON.parse(
      localStorage.getItem('reserve_balances') ?? '{}'
    )
    const networkReserves = newReserves?.[network] ?? {}
    networkReserves[address] = amount.toString()
    newReserves[network] = networkReserves
    localStorage.setItem('reserve_balances', JSON.stringify(newReserves))
  } catch (e) {
    localStorage.removeItem('reserve_balances')
  }
}
