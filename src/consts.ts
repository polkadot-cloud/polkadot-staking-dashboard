// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NodeEndpoints } from 'types';
import { stringToU8a } from '@polkadot/util';

/*
 * SVGs
 */
import { ReactComponent as PolkadotIconSVG } from 'img/polkadot_icon.svg';
import { ReactComponent as KusamaLogoSVG } from 'img/kusama_logo.svg';
import { ReactComponent as WestendIconSVG } from 'img/westend_icon.svg';
import { ReactComponent as PolkadotLogoSVG } from 'img/polkadot_logo.svg';
import { ReactComponent as KusamaIconSVG } from 'img/kusama_icon.svg';

/*
 * Global Constants
 */
export const URI_PREFIX = '/polkadot-staking-dashboard';
export const TITLE_DEFAULT = 'Polkadot Staking Dashboard';
export const DAPP_NAME = 'polkadot_staking_dashboard';

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

/*
 * Network Configuration
 */
export const NODE_ENDPOINTS: NodeEndpoints = {
  polkadot: {
    name: 'Polkadot',
    colors: {
      light: 'rgb(211, 48, 121)',
      dark: 'rgb(211, 48, 121)',
    },
    endpoint: 'wss://rpc.polkadot.io',
    subscanEndpoint: 'https://polkadot.api.subscan.io',
    unit: 'DOT',
    units: 10,
    ss58: 0,
    icon: PolkadotIconSVG,
    logo: PolkadotLogoSVG,
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    },
    features: {
      pools: false,
    },
  },
  kusama: {
    name: 'Kusama',
    colors: {
      light: '#111',
      dark: '#ccc',
    },
    endpoint: 'wss://kusama-rpc.polkadot.io',
    subscanEndpoint: 'https://kusama.api.subscan.io',
    unit: 'KSM',
    units: 12,
    ss58: 2,
    icon: KusamaIconSVG,
    logo: KusamaLogoSVG,
    api: {
      unit: 'KSM',
      priceTicker: 'KSMUSDT',
    },
    features: {
      pools: true,
    },
  },
  westend: {
    name: 'Westend',
    colors: {
      light: '#ed7f5e',
      dark: '#ed7f5e',
    },
    endpoint: 'wss://westend-rpc.polkadot.io',
    subscanEndpoint: 'https://westend.api.subscan.io',
    unit: 'WND',
    units: 12,
    ss58: 42,
    icon: WestendIconSVG,
    logo: PolkadotLogoSVG,
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    },
    features: {
      pools: true,
    },
  },
};

export const POLKADOT_URL = 'https://polkadot.network';

export const CONNECTION_SYMBOL_COLORS: any = {
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
export const SIDE_MENU_INTERFACE_WIDTH = 180;
export const SIDE_MENU_STICKY_THRESHOLD = 1175;
export const SECTION_FULL_WIDTH_THRESHOLD = 1050;
export const SHOW_SIDE_BAR_WIDTH_THRESHOLD = 950;
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

/*
 * Third party API keys and endpoints
 */

export const API_SUBSCAN_KEY = 'd37149339f64775155a82a53f4253b27';

export const ENDPOINT_PRICE = 'https://api.binance.com/api/v3';

export const API_ENDPOINTS = {
  priceChange: `${ENDPOINT_PRICE}/ticker/24hr?symbol=`,
  subscanRewardSlash: '/api/scan/account/reward_slash',
  subscanEraStat: '/api/scan/staking/era_stat',
};
