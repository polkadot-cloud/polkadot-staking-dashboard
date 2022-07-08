// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

/*
 * Global Constants
 */
export const URI_PREFIX = '/polkadot-staking-dashboard';
export const TITLE_DEFAULT = 'Polkadot Staking Dashboard';
export const DAPP_NAME = 'polkadot_staking_dashboard';
export const POLKADOT_URL = 'https://polkadot.network';

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

export const CONNECTION_SYMBOL_COLORS: { [key: string]: string } = {
  disconnected: 'red',
  connecting: 'orange',
  connected: 'green',
};

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

export const INTERFACE_MAXIMUM_WIDTH = 1800;
export const SIDE_MENU_MAXIMISED_WIDTH = 180;
export const SIDE_MENU_MINIMISED_WIDTH = 75;
export const SIDE_MENU_STICKY_THRESHOLD = 1175;
export const SECTION_FULL_WIDTH_THRESHOLD = 1050;
export const SHOW_SIDE_BAR_WIDTH_THRESHOLD = 1000;
export const MAX_ASSISTANT_INTERFACE_WIDTH = 500;
export const MAX_SIDE_BAR_INTERFACE_WIDTH = 400;
export const FLOATING_MENU_WIDTH = 250;
export const GRAPH_HEIGHT = 390;

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
  subscanRewardSlash: '/api/scan/account/reward_slash',
  subscanPoolRewards: '/api/scan/nomination_pool/rewards',
  subscanEraStat: '/api/scan/staking/era_stat',
};
