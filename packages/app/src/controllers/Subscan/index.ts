// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { poolMembersPerPage } from 'library/List/defaults'
import type { PoolMember } from 'types'
import type {
  SubscanData,
  SubscanEraPoints,
  SubscanPoolClaim,
  SubscanPoolClaimRaw,
  SubscanPoolMember,
  SubscanRequestBody,
} from './types'

export class Subscan {
  // List of endpoints to be used for Subscan API calls.
  static ENDPOINTS = {
    eraStat: '/api/scan/staking/era_stat',
    poolMembers: '/api/scan/nomination_pool/pool/members',
    poolRewards: '/api/scan/nomination_pool/rewards',
    rewardSlash: '/api/v2/scan/account/reward_slash',
  }

  // Total amount of requests that can be made in 1 second.
  static TOTAL_REQUESTS_PER_SECOND = 5

  // The network to use for Subscan API calls.
  static network: string

  // Subscan payout data, keyed by address.
  static payoutData: Record<string, SubscanData> = {}

  // Subscan pool data, keyed by `<network>-<poolId>-<key1>-<key2>...`.
  static poolData: Record<string, PoolMember[]> = {}

  // Subscan era points data, keyed by `<network>-<address>-<era>`.
  static eraPointsData: Record<string, SubscanEraPoints[]> = {}

  // Set the network to use for Subscan API calls.
  //
  // Effects the endpoint being used. Should be updated on network change in the UI.
  set network(network: string) {
    Subscan.network = network
  }

  // Handle fetching the various types of payout and set state in one render.
  static handleFetchPayouts = async (address: string): Promise<void> => {
    try {
      if (!this.payoutData[address]) {
        const poolClaims = await this.fetchPoolClaims(address)
        this.payoutData[address] = {
          poolClaims,
        }

        document.dispatchEvent(
          new CustomEvent('subscan-data-updated', {
            detail: {
              keys: ['poolClaims'],
            },
          })
        )
      }
    } catch (e) {
      // Silently fail request.
    }
  }

  // Fetch pool claims from Subscan, ensuring no payouts have block_timestamp of 0.
  static fetchPoolClaims = async (
    address: string
  ): Promise<SubscanPoolClaim[]> => {
    try {
      const result = await this.makeRequest(this.ENDPOINTS.poolRewards, {
        address,
        row: 100,
        page: 0,
      })
      if (!result?.list) {
        return []
      }
      // Remove claims with a `block_timestamp`.
      const poolClaims = result.list
        .filter((l: SubscanPoolClaimRaw) => l.block_timestamp !== 0)
        .map((l: SubscanPoolClaimRaw) => ({
          ...l,
          reward: l.amount,
          timestamp: l.block_timestamp,
          type: 'pool',
        }))

      return poolClaims
    } catch (e) {
      // Silently fail request and return empty record.
      return []
    }
  }

  // Fetch a page of pool members from Subscan.
  static fetchPoolMembers = async (
    poolId: number,
    page: number
  ): Promise<PoolMember[]> => {
    const result = await this.makeRequest(this.ENDPOINTS.poolMembers, {
      pool_id: poolId,
      row: poolMembersPerPage,
      page: page - 1,
    })
    if (!result?.list) {
      return []
    }
    // Format list and return.
    return result.list
      .map((entry: SubscanPoolMember) => ({
        who: entry.account_display.address,
        poolId: entry.pool_id,
      }))
      .reverse()
      .splice(0, result.list.length - 1)
  }

  // Fetch a pool's era points from Subscan.
  static fetchEraPoints = async (
    address: string,
    era: number
  ): Promise<SubscanEraPoints[]> => {
    const result = await this.makeRequest(this.ENDPOINTS.eraStat, {
      page: 0,
      row: 100,
      address,
    })
    if (!result) {
      return []
    }

    // Format list to just contain reward points.
    const list = []
    for (let i = era; i > era - 100; i--) {
      list.push({
        era: i,
        reward_point:
          result.list.find(
            ({ era: resultEra }: { era: number }) => resultEra === i
          )?.reward_point ?? 0,
      })
    }
    // Removes last zero item and return.
    return list.reverse().splice(0, list.length - 1)
  }

  // Handle fetching pool members.
  static handleFetchPoolMembers = async (poolId: number, page: number) => {
    const dataKey = `${this.network}-${poolId}-${page}-members}`
    const currentValue = this.poolData[dataKey]

    if (currentValue) {
      return currentValue
    } else {
      const result = await this.fetchPoolMembers(poolId, page)
      this.poolData[dataKey] = result

      return result
    }
  }

  // Handle fetching era point history.
  static handleFetchEraPoints = async (address: string, era: number) => {
    const dataKey = `${this.network}-${address}-${era}}`
    const currentValue = this.eraPointsData[dataKey]

    if (currentValue) {
      return currentValue
    } else {
      const result = await this.fetchEraPoints(address, era)
      this.eraPointsData[dataKey] = result
      return result
    }
  }

  // Resets all received data from class.
  static resetData = () => {
    this.payoutData = {}
  }

  // Get the public Subscan endpoint.
  static getEndpoint = () => `https://${this.network}.api.subscan.io`

  // Make a request to Subscan and return any data returned from the response.
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
