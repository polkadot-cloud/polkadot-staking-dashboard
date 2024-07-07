// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  SubscanPoolClaim,
  SubscanData,
  SubscanPayout,
  SubscanPoolMember,
  SubscanRequestBody,
  SubscanEraPoints,
} from './types';
import type { Locale } from 'date-fns';
import { format, fromUnixTime, getUnixTime, subDays } from 'date-fns';
import type { PoolMember } from 'contexts/Pools/PoolMembers/types';
import { poolMembersPerPage } from 'library/List/defaults';

export class SubscanController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // List of endpoints to be used for Subscan API calls.
  static ENDPOINTS = {
    eraStat: '/api/scan/staking/era_stat',
    poolMembers: '/api/scan/nomination_pool/pool/members',
    poolRewards: '/api/scan/nomination_pool/rewards',
    rewardSlash: '/api/v2/scan/account/reward_slash',
  };

  // Total amount of requests that can be made in 1 second.
  static TOTAL_REQUESTS_PER_SECOND = 5;

  // Maximum amount of payout days supported.
  static MAX_PAYOUT_DAYS = 60;

  // The network to use for Subscan API calls.
  static network: string;

  // Subscan payout data, keyed by address.
  static payoutData: Record<string, SubscanData> = {};

  // Subscan pool data, keyed by `<network>-<poolId>-<key1>-<key2>...`.
  static poolData: Record<string, PoolMember[]> = {};

  // Subscan era points data, keyed by `<network>-<address>-<era>`.
  static eraPointsData: Record<string, SubscanEraPoints[]> = {};

  // ------------------------------------------------------
  // Setters.
  // ------------------------------------------------------

  // Set the network to use for Subscan API calls.
  //
  // Effects the endpoint being used. Should be updated on network change in the UI.
  set network(network: string) {
    SubscanController.network = network;
  }

  // ------------------------------------------------------
  // Handling multiple requests.
  // ------------------------------------------------------

  // Handle fetching the various types of payout and set state in one render.
  static handleFetchPayouts = async (address: string) => {
    if (!this.payoutData[address]) {
      const results = await Promise.all([
        this.fetchNominatorPayouts(address),
        this.fetchPoolClaims(address),
      ]);
      const { payouts, unclaimedPayouts } = results[0];
      const poolClaims = results[1];

      // Persist results to class.
      this.payoutData[address] = {
        payouts,
        unclaimedPayouts,
        poolClaims,
      };

      document.dispatchEvent(
        new CustomEvent('subscan-data-updated', {
          detail: {
            keys: ['payouts', 'unclaimedPayouts', 'poolClaims'],
          },
        })
      );
    }
  };

  // ------------------------------------------------------
  // Handling requests.
  // ------------------------------------------------------

  // Fetch nominator payouts from Subscan. NOTE: Payouts with a `block_timestamp` of 0 are
  // unclaimed.
  static fetchNominatorPayouts = async (
    address: string
  ): Promise<{
    payouts: SubscanPayout[];
    unclaimedPayouts: SubscanPayout[];
  }> => {
    const result = await this.makeRequest(this.ENDPOINTS.rewardSlash, {
      address,
      is_stash: true,
      row: 100,
      page: 0,
    });

    const payouts =
      result?.list?.filter(
        ({ block_timestamp }: SubscanPayout) => block_timestamp !== 0
      ) || [];

    let unclaimedPayouts =
      result?.list?.filter((l: SubscanPayout) => l.block_timestamp === 0) || [];

    // Further filter unclaimed payouts to ensure that payout records of `stash` and
    // `validator_stash` are not repeated for an era. NOTE: This was introduced to remove errornous
    // data where there were duplicated payout records (with different amounts) for a stash -
    // validator - era record. from Subscan.
    unclaimedPayouts = unclaimedPayouts.filter(
      (u: SubscanPayout) =>
        !payouts.find(
          (p: SubscanPayout) =>
            p.stash === u.stash &&
            p.validator_stash === u.validator_stash &&
            p.era === u.era
        )
    );

    return { payouts, unclaimedPayouts };
  };

  // Fetch pool claims from Subscan, ensuring no payouts have block_timestamp of 0.
  static fetchPoolClaims = async (
    address: string
  ): Promise<SubscanPoolClaim[]> => {
    const result = await this.makeRequest(this.ENDPOINTS.poolRewards, {
      address,
      row: 100,
      page: 0,
    });
    if (!result?.list) {
      return [];
    }
    // Remove claims with a `block_timestamp`.
    const poolClaims = result.list.filter(
      (l: SubscanPoolClaim) => l.block_timestamp !== 0
    );
    return poolClaims;
  };

  // Fetch a page of pool members from Subscan.
  static fetchPoolMembers = async (
    poolId: number,
    page: number
  ): Promise<PoolMember[]> => {
    const result = await this.makeRequest(this.ENDPOINTS.poolMembers, {
      pool_id: poolId,
      row: poolMembersPerPage,
      page: page - 1,
    });
    if (!result?.list) {
      return [];
    }
    // Format list and return.
    return result.list
      .map((entry: SubscanPoolMember) => ({
        who: entry.account_display.address,
        poolId: entry.pool_id,
      }))
      .reverse()
      .splice(0, result.list.length - 1);
  };

  // Fetch a pool's era points from Subscan.
  static fetchEraPoints = async (
    address: string,
    era: number
  ): Promise<SubscanEraPoints[]> => {
    const result = await this.makeRequest(this.ENDPOINTS.eraStat, {
      page: 0,
      row: 100,
      address,
    });
    if (!result) {
      return [];
    }

    // Format list to just contain reward points.
    const list = [];
    for (let i = era; i > era - 100; i--) {
      list.push({
        era: i,
        reward_point:
          result.list.find(
            ({ era: resultEra }: { era: number }) => resultEra === i
          )?.reward_point ?? 0,
      });
    }
    // Removes last zero item and return.
    return list.reverse().splice(0, list.length - 1);
  };

  // Handle fetching pool members.
  static handleFetchPoolMembers = async (poolId: number, page: number) => {
    const dataKey = `${this.network}-${poolId}-${page}-members}`;
    const currentValue = this.poolData[dataKey];

    if (currentValue) {
      return currentValue;
    } else {
      const result = await this.fetchPoolMembers(poolId, page);
      this.poolData[dataKey] = result;

      return result;
    }
  };

  // Handle fetching era point history.
  static handleFetchEraPoints = async (address: string, era: number) => {
    const dataKey = `${this.network}-${address}-${era}}`;
    const currentValue = this.eraPointsData[dataKey];

    if (currentValue) {
      return currentValue;
    } else {
      const result = await this.fetchEraPoints(address, era);
      this.eraPointsData[dataKey] = result;
      return result;
    }
  };

  // ------------------------------------------------------
  // Class utilities.
  // ------------------------------------------------------

  // Resets all received data from class.
  static resetData = () => {
    this.payoutData = {};
  };

  // Remove unclaimed payouts and dispatch update event.
  static removeUnclaimedPayouts = (address: string, eraPayouts: string[]) => {
    const newUnclaimedPayouts = (this.payoutData[address]?.unclaimedPayouts ||
      []) as SubscanPayout[];

    eraPayouts.forEach(([era]) => {
      newUnclaimedPayouts.filter((u) => String(u.era) !== era);
    });
    this.payoutData[address].unclaimedPayouts = newUnclaimedPayouts;

    document.dispatchEvent(
      new CustomEvent('subscan-data-updated', {
        detail: {
          keys: ['unclaimedPayouts'],
        },
      })
    );
  };

  // Take non-zero rewards in most-recent order.
  static removeNonZeroAmountAndSort = (payouts: SubscanPayout[]) => {
    const list = payouts
      .filter((p) => Number(p.amount) > 0)
      .sort((a, b) => b.block_timestamp - a.block_timestamp);

    // Calculates from the current date.
    const fromTimestamp = getUnixTime(
      subDays(new Date(), this.MAX_PAYOUT_DAYS)
    );
    // Ensure payouts not older than `MAX_PAYOUT_DAYS` are returned.
    return list.filter(
      ({ block_timestamp }) => block_timestamp >= fromTimestamp
    );
  };

  // Calculate the earliest date of a payout list.
  static payoutsFromDate = (payouts: SubscanPayout[], locale: Locale) => {
    if (!payouts.length) {
      return undefined;
    }
    const filtered = this.removeNonZeroAmountAndSort(payouts || []);
    if (!filtered.length) {
      return undefined;
    }
    return format(
      fromUnixTime(filtered[filtered.length - 1].block_timestamp),
      'do MMM',
      {
        locale,
      }
    );
  };

  // Calculate the latest date of a payout list.
  static payoutsToDate = (payouts: SubscanPayout[], locale: Locale) => {
    if (!payouts.length) {
      return undefined;
    }
    const filtered = this.removeNonZeroAmountAndSort(payouts || []);
    if (!filtered.length) {
      return undefined;
    }

    return format(fromUnixTime(filtered[0].block_timestamp), 'do MMM', {
      locale,
    });
  };

  // ------------------------------------------------------
  // Helpers for making requests.
  // ------------------------------------------------------

  // Get the public Subscan endpoint.
  static getEndpoint = () => `https://${this.network}.api.subscan.io`;

  // Make a request to Subscan and return any data returned from the response.
  static makeRequest = async (endpoint: string, body: SubscanRequestBody) => {
    const res: Response = await fetch(this.getEndpoint() + endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
    });
    const json = await res.json();
    return json?.data || undefined;
  };
}
