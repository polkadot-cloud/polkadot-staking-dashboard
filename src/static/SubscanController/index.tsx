// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';
import type { SubscanData } from './types';
import { format, fromUnixTime, getUnixTime, subDays } from 'date-fns';
import { ListItemsPerPage } from 'consts';

// A class to manage Subscan API Calls.
//
// TODO: Implement timeouts to not call more than 5 requests in 1 second.
//
// TODO: Handle caching of results in local storage, key by era and refresh if outdated.
export class SubscanController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Public Subscan API Key.
  static API_KEY = 'd37149339f64775155a82a53f4253b27';

  // List of endpoints to be used for Subscan API calls.
  static ENDPOINTS = {
    eraStat: '/api/scan/staking/era_stat',
    poolDetails: '/api/scan/nomination_pool/pool',
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

  // Subscan data for the current account.
  static data: SubscanData;

  // The timestamp of the last 5 requests made.
  static _lastRequestTimes = [];

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
  // Handling requests.
  // ------------------------------------------------------

  // Fetch nominator payouts from Subscan. NOTE: Payouts with a `block_timestamp` of 0 are
  // unclaimed.
  static fetchNominatorPayouts = async (address: string): Promise<AnyJson> => {
    const result: AnyJson = await this.makeRequest(this.ENDPOINTS.rewardSlash, {
      address,
      is_stash: true,
      row: 100,
      page: 0,
    });
    // TODO: SubscanResult<T>.
    if (!result?.list) {
      return { payouts: [], unclaimedPayouts: [] };
    }

    const payouts = result.list.filter((l: AnyJson) => l.block_timestamp !== 0);
    const unclaimedPayouts = result.list.filter(
      (l: AnyJson) => l.block_timestamp === 0
    );
    return { payouts, unclaimedPayouts };
  };

  // Fetch pool claims from Subscan, ensuring no payouts have block_timestamp of 0.
  static fetchPoolClaims = async (address: string): Promise<AnyJson> => {
    const result: AnyJson = await this.makeRequest(this.ENDPOINTS.poolRewards, {
      address,
      row: 100,
      page: 0,
    });
    // TODO: SubscanResult<T>.
    if (!result?.list) {
      return [];
    }

    // Remove claims with a `block_timestamp`.
    const poolClaims = result.list.filter(
      (l: AnyJson) => l.block_timestamp !== 0
    );
    return poolClaims;
  };

  // Fetch a page of pool members from Subscan.
  static fetchPoolMembers = async (poolId: number, page: number) => {
    const result: AnyJson = await this.makeRequest(this.ENDPOINTS.poolMembers, {
      pool_id: poolId,
      row: ListItemsPerPage,
      page: page - 1,
    });

    // TODO: SubscanResult<T>.
    if (!result?.list) {
      return [];
    }
    // Format list and return.
    return result.list
      .map((entry: AnyJson) => ({
        who: entry.account_display.address,
        poolId: entry.pool_id,
      }))
      .reverse()
      .splice(0, result.list.length - 1);
  };

  // Fetch a pool's details from Subscan.
  static fetchPoolDetails = async (poolId: number) => {
    const result: AnyJson = await this.makeRequest(this.ENDPOINTS.poolDetails, {
      pool_id: poolId,
    });

    // TODO: SubscanResult<T>.
    if (!result) {
      return undefined;
    }
    return result;
  };

  // Fetch a pool's era points from Subscan.
  static fetchEraPoints = async (address: string, era: number) => {
    const result: AnyJson = await this.makeRequest(this.ENDPOINTS.eraStat, {
      page: 0,
      row: 100,
      address,
    });

    // TODO: SubscanResult<T>.
    if (!result) {
      return [];
    }

    // Format list to just contain reward points.
    const list = [];
    for (let i = era; i > era - 100; i--) {
      list.push({
        era: i,
        reward_point:
          result.list.find((item: AnyJson) => item.era === i)?.reward_point ??
          0,
      });
    }
    // Removes last zero item and return.
    return list.reverse().splice(0, list.length - 1);
  };

  // ------------------------------------------------------
  // Handling multiple requests concurrently.
  // ------------------------------------------------------

  // Handle fetching the various types of payout and set state in one render.
  static handleFetchPayouts = async (address: string) => {
    const results = await Promise.all([
      this.fetchNominatorPayouts(address),
      this.fetchPoolClaims(address),
    ]);
    const { payouts, unclaimedPayouts } = results[0];
    const poolClaims = results[1];

    // Persist results to class.
    this.data['payouts'] = payouts;
    this.data['unclaimedPayouts'] = unclaimedPayouts;
    this.data['poolClaims'] = poolClaims;

    document.dispatchEvent(
      new CustomEvent('subscan-data-updated', {
        detail: {
          keys: ['payouts', 'unclaimedPayouts', 'poolClaims'],
        },
      })
    );
  };

  // Handle fetching pool members.
  static handleFetchPoolMembers = async (poolId: number, page: number) => {
    const poolMembers = await this.fetchPoolMembers(poolId, page);
    return poolMembers;
  };

  // Handle fetching pool details.
  static handleFetchPoolDetails = async (poolId: number) => {
    const poolDetails = await this.fetchPoolDetails(poolId);
    return poolDetails;
  };

  // Handle fetching era point history.
  static handleFetchEraPoints = async (address: string, era: number) => {
    const eraPoints = await this.fetchEraPoints(address, era);
    return eraPoints;
  };

  // ------------------------------------------------------
  // Helpers for making requests.
  // ------------------------------------------------------

  // Get the public Subscan endpoint.
  static getEndpoint = () => `https://${this.network}.api.subscan.io`;

  // Make a request to Subscan and return any data returned from the response.
  static makeRequest = async (endpoint: string, body: AnyJson) => {
    const res: Response = await fetch(this.getEndpoint() + endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.API_KEY,
      },
      body: JSON.stringify(body),
      method: 'POST',
    });
    const json = await res.json();
    return json?.data || undefined;
  };

  // ------------------------------------------------------
  // Class utilities.
  // ------------------------------------------------------

  // Resets all received data from class.
  static resetData = () => {
    this.data = {};
  };

  // Remove unclaimed payouts and dispatch update event.
  static removeUnclaimedPayout = (updates: Record<string, string[]>) => {
    const updatedUnclaimedPayouts = this.data['unclaimedPayouts'];

    console.log('before updates', updatedUnclaimedPayouts);

    Object.entries(updates).forEach(([era, validators]) => {
      updatedUnclaimedPayouts.filter(
        (u: AnyJson) =>
          !(validators.includes(u.validator_stash) && String(u.era) === era)
      );
    });

    console.log('after updates', updatedUnclaimedPayouts);

    this.data['unclaimedPayouts'] = updatedUnclaimedPayouts;

    document.dispatchEvent(
      new CustomEvent('subscan-data-updated', {
        detail: {
          keys: ['unclaimedPayouts'],
        },
      })
    );
  };

  // Take non-zero rewards in most-recent order.
  static removeNonZeroAmountAndSort = (payouts: AnyJson[]) => {
    const list = payouts
      .filter((p) => p.amount > 0)
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
  static payoutsFromDate = (payouts: AnyJson[], locale: AnyJson) => {
    if (!payouts.length) {
      return undefined;
    }
    const filtered = this.removeNonZeroAmountAndSort(payouts || []);
    return format(
      fromUnixTime(filtered[filtered.length - 1].block_timestamp),
      'do MMM',
      {
        locale,
      }
    );
  };

  // Calculate the latest date of a payout list.
  static payoutsToDate = (payouts: AnyJson[], locale: AnyJson) => {
    if (!payouts.length) {
      return undefined;
    }
    const filtered = this.removeNonZeroAmountAndSort(payouts || []);
    return format(fromUnixTime(filtered[0].block_timestamp), 'do MMM', {
      locale,
    });
  };
}
