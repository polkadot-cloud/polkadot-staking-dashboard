// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolMember } from 'types'
import type { SubscanPoolMember, SubscanRequestBody } from './types'

export class Subscan {
  static ENDPOINTS = {
    poolMembers: '/api/scan/nomination_pool/pool/members',
  }

  // The network to use for Subscan API calls
  static network: string

  // Subscan pool data, keyed by `<network>-<poolId>-<key1>-<key2>...`
  static poolData: Record<string, PoolMember[]> = {}

  // Set the network to use for Subscan API calls
  set network(network: string) {
    Subscan.network = network
  }

  // Fetch a page of pool members from Subscan
  static fetchPoolMembers = async (
    poolId: number,
    page: number,
    row: number
  ): Promise<PoolMember[]> => {
    const result = await this.makeRequest(this.ENDPOINTS.poolMembers, {
      pool_id: poolId,
      row,
      page: page - 1,
    })
    if (!result?.list) {
      return []
    }
    // Format list and return
    return result.list
      .map((entry: SubscanPoolMember) => ({
        who: entry.account_display.address,
        poolId: entry.pool_id,
      }))
      .reverse()
  }

  // Handle fetching pool members
  static handleFetchPoolMembers = async (
    poolId: number,
    page: number,
    itemsPerPage: number
  ) => {
    const dataKey = `${this.network}-${poolId}-${page}-members}`
    const currentValue = this.poolData[dataKey]

    if (currentValue) {
      return currentValue
    } else {
      const result = await this.fetchPoolMembers(poolId, page, itemsPerPage)
      this.poolData[dataKey] = result

      return result
    }
  }

  // Get the public Subscan endpoint
  static getEndpoint = () => `https://${this.network}.api.subscan.io`

  // Make a request to Subscan and return any data returned from the response
  static makeRequest = async (endpoint: string, body: SubscanRequestBody) => {
    const res: Response = await fetch(this.getEndpoint() + endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
    })
    const json = await res.json()
    return json?.data || undefined
  }
}
