// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { bnToU8a, concatU8a, encodeAddress, stringToU8a } from 'dedot/utils'
import type { BondedPool } from 'types'

// Generates pool stash and reward accounts. Assumes `poolsPalletId` is synced
export const createPoolAccounts = (
  poolId: number,
  poolsPalletId: Uint8Array,
  ss58Format: number = 0
) => {
  const createAccount = (index: number): string => {
    const key = concatU8a(
      stringToU8a('modl'),
      poolsPalletId,
      new Uint8Array([index]),
      bnToU8a(BigInt(poolId.toString())).reverse(), // NOTE: Reversing for little endian
      new Uint8Array(32)
    )
    return encodeAddress(key.slice(0, 32), ss58Format)
  }

  return {
    stash: createAccount(0),
    reward: createAccount(1),
  }
}

// Pool search filter function for finding pools by ID, metadata, or address
export const poolSearchFilter = (
  pools: BondedPool[],
  searchTerm: string,
  poolsMetaData: Record<number, string> = {}
): BondedPool[] => {
  const filteredList: BondedPool[] = []

  for (const pool of pools) {
    // If pool metadata has not yet been synced, include the pool in results
    if (!Object.values(poolsMetaData).length) {
      filteredList.push(pool)
      continue
    }

    const address = pool?.addresses?.stash ?? ''
    const metadata = poolsMetaData[pool.id] || ''
    const searchTermLower = searchTerm.toLowerCase()

    // Enhanced pool ID matching logic
    let poolIdMatches = false

    // 1. Direct number match (e.g., "123" matches pool 123)
    if (String(pool.id) === searchTerm) {
      poolIdMatches = true
    }
    // 2. Pool ID contains the search term (for partial matches)
    else if (String(pool.id).includes(searchTermLower)) {
      poolIdMatches = true
    }
    // 3. "Pool X" format (e.g., "Pool 123" should match pool 123)
    else if (searchTermLower.startsWith('pool ')) {
      const poolNumber = searchTermLower.replace('pool ', '').trim()
      if (String(pool.id) === poolNumber) {
        poolIdMatches = true
      }
    }
    // 4. Extract numbers from search term and match against pool ID
    else {
      const numbersInSearch = searchTerm.match(/\d+/g)
      if (numbersInSearch) {
        for (const num of numbersInSearch) {
          if (String(pool.id) === num) {
            poolIdMatches = true
            break
          }
        }
      }
    }

    if (poolIdMatches) {
      filteredList.push(pool)
    }
    if (address.toLowerCase().includes(searchTermLower)) {
      filteredList.push(pool)
    }
    if (metadata.toLowerCase().includes(searchTermLower)) {
      filteredList.push(pool)
    }
  }

  // Remove duplicates
  return filteredList.filter(
    (value, index, self) => index === self.findIndex((i) => i.id === value.id)
  )
}
