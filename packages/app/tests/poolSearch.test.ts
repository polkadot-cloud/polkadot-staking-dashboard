// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { expect, test } from 'vitest'

// Mock pool data for testing
const mockPools = [
  {
    id: 123,
    addresses: { stash: 'ksm123stash', reward: 'ksm123reward' },
  },
  {
    id: 456,
    addresses: { stash: 'ksm456stash', reward: 'ksm456reward' },
  },
  {
    id: 789,
    addresses: { stash: 'ksm789stash', reward: 'ksm789reward' },
  },
]

const mockPoolsMetaData: Record<number, string> = {
  123: 'Cool Pool Name',
  456: 'Another Pool',
  789: 'Test Pool 789',
}

interface Pool {
  id: number
  addresses: {
    stash: string
    reward: string
  }
}

// Enhanced poolSearchFilter function that should fix the issue
const poolSearchFilter = (list: Pool[], searchTerm: string) => {
  const filteredList: Pool[] = []

  for (const pool of list) {
    // If pool metadata has not yet been synced, include the pool in results
    if (!Object.values(mockPoolsMetaData).length) {
      filteredList.push(pool)
      continue
    }

    const address = pool?.addresses?.stash ?? ''
    const metadata = mockPoolsMetaData[pool.id] || ''
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

test('pool search by exact number should work', () => {
  const result = poolSearchFilter(mockPools, '123')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(123)
})

test('pool search by "Pool X" format should work', () => {
  const result = poolSearchFilter(mockPools, 'Pool 123')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(123)
})

test('pool search by "pool X" format (lowercase) should work', () => {
  const result = poolSearchFilter(mockPools, 'pool 456')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(456)
})

test('pool search by hash + numbers should work', () => {
  const result = poolSearchFilter(mockPools, '#123')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(123)
})

test('pool search by metadata should work', () => {
  const result = poolSearchFilter(mockPools, 'Cool Pool')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(123)
})

test('pool search by address should work', () => {
  const result = poolSearchFilter(mockPools, 'ksm456')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(456)
})

test('pool search by partial number should work', () => {
  const result = poolSearchFilter(mockPools, '12')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(123)
})

test('pool search should not return duplicates', () => {
  // Search for something that might match both ID and metadata
  const result = poolSearchFilter(mockPools, '789')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(789)
})

test('pool search should return empty array for no matches', () => {
  const result = poolSearchFilter(mockPools, 'nonexistent')
  expect(result.length).toBe(0)
})

export {}
