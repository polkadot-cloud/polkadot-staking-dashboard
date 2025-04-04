// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import { unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import type { NetworkId } from 'common-types'

// Get the local storage record for an account reserve balance
export const getLocalFeeReserve = (
  address: MaybeString,
  defaultReserve: number,
  { network, units }: { network: NetworkId; units: number }
): BigNumber => {
  const reserves = JSON.parse(localStorage.getItem('reserve_balances') ?? '{}')
  return new BigNumber(
    reserves?.[network]?.[address || ''] ??
      unitToPlanck(String(defaultReserve), units)
  )
}

// Sets the local storage record fro an account reserve balance
export const setLocalFeeReserve = (
  address: MaybeString,
  amount: BigNumber,
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
