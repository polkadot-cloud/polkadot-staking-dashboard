// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

/*
 * Global Constants
 */
export const URI_PREFIX = '/';
export const TITLE_DEFAULT = 'Polkadot Staking Dashboard';
export const DAPP_NAME = 'Polkadot Staking Dashboard';
export const POLKADOT_URL = 'https://polkadot.network/staking/';

export const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';
export const WESTEND_ENDPOINT = 'wss://westend-rpc.polkadot.io';
export const DEFAULT_NETWORK = 'polkadot';
export const ACTIVE_NETWORK = 'polkadot';

/*
 * Data Structure Helpers
 */
export const EMPTY_H256 = new Uint8Array(32);
export const MOD_PREFIX = stringToU8a('modl');
export const U32_OPTS = { bitLength: 32, isLe: true };

export const PAYEE_STATUS = [
  {
    key: 'Staked',
    name: 'Back to Staking',
  },
  {
    key: 'Stash',
    name: 'To Stash Account',
  },
  {
    key: 'Controller',
    name: 'To Controller Account',
  },
];

export const INTERFACE_MAXIMUM_WIDTH = 1550;
export const SIDE_MENU_MAXIMISED_WIDTH = 185;
export const SIDE_MENU_MINIMISED_WIDTH = 75;
export const SIDE_MENU_STICKY_THRESHOLD = 1175;
export const SECTION_FULL_WIDTH_THRESHOLD = 1050;
export const SHOW_ACCOUNTS_BUTTON_WIDTH_THRESHOLD = 1000;
export const FLOATING_MENU_WIDTH = 250;
export const GRAPH_HEIGHT = 390;
export const SMALL_FONT_SIZE_MAX_WIDTH = 600;
export const MEDIUM_FONT_SiZE_MAX_WIDTH = 1600;

/*
 * Toggle-able services
 */
export const SERVICES = ['subscan', 'binance_spot'];

/*
 * Fallback config values
 */
export const MAX_NOMINATIONS = 16;
export const BONDING_DURATION = 28;
export const SESSIONS_PER_ERA = 6;
export const MAX_NOMINATOR_REWARDED_PER_VALIDATOR = 256;
export const VOTER_SNAPSHOT_PER_BLOCK = 22500;
export const MAX_ELECTING_VOTERS = 22500;
export const EXPECTED_BLOCK_TIME = 6000;

/*
 * Misc values
 */
export const RESERVE_AMOUNT_DOT = 0.1;
export const LIST_ITEMS_PER_PAGE = 50;
export const LIST_ITEMS_PER_BATCH = 30;
export const MIN_BOND_PRECISION = 3;
export const MAX_PAYOUT_DAYS = 60;

/*
 * Third party API keys and endpoints
 */
export const API_SUBSCAN_KEY = 'd37149339f64775155a82a53f4253b27';
export const ENDPOINT_PRICE = 'https://api.binance.com/api/v3';
export const API_ENDPOINTS = {
  priceChange: `${ENDPOINT_PRICE}/ticker/24hr?symbol=`,
  subscanRewardSlash: '/api/v2/scan/account/reward_slash',
  subscanPoolRewards: '/api/scan/nomination_pool/rewards',
  subscanEraStat: '/api/scan/staking/era_stat',
};

/*
 * default network parameters
 */
export const DEFAULT_PARAMS = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5,
};

/*
 * default language
 */
export const DEFAULT_LOCALE = 'en';
