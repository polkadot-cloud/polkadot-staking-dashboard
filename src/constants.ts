// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

/*
 * SVGs 
*/
import { ReactComponent as PolkadotLogoSVG } from './img/polkadot_icon.svg';
import { ReactComponent as WestendLogoSVG } from './img/westend_icon.svg';

/*
 * Global Constants 
*/
export const URI_PREFIX = '/polkadot-staking-dashboard';

export const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';
export const WESTEND_ENDPOINT = 'wss://westend-rpc.polkadot.io';
export const DEFAULT_NETWORK = 'polkadot';
export const ACTIVE_NETWORK = 'polkadot';

export const NODE_ENDPOINTS: any = {
  polkadot: {
    name: 'Polkadot',
    endpoint: 'wss://rpc.polkadot.io',
    subscanEndpoint: 'https://polkadot.api.subscan.io',
    unit: 'DOT',
    icon: PolkadotLogoSVG,
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    }
  },
  westend: {
    name: 'Westend',
    endpoint: 'wss://westend-rpc.polkadot.io',
    subscanEndpoint: 'https://westend.api.subscan.io',
    unit: 'WND',
    icon: WestendLogoSVG,
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    }
  }
};

export const POLKADOT_URL = 'https://polkadot.network';

export const CONNECTION_STATUS = [
  'disconnected',
  'connecting',
  'connected',
];

export const CONNECTION_SYMBOL_COLORS: any = {
  disconnected: 'red',
  connecting: 'orange',
  connected: 'green',
}

export const INTERFACE_MINIMUM_WIDTH: number = 800;
export const INTERFACE_MAXIMUM_WIDTH: number = 1325;
export const INTERFACE_MINIMUM_HEIGHT: number = 400;
export const SIDE_MENU_INTERFACE_WIDTH: number = 200;
export const MAX_ASSISTANT_INTERFACE_WIDTH: number = 500;

/*
 * Global messages for app components
*/
export const GLOBAL_MESSGE_KEYS = {
  CONTROLLER_NOT_IMPORTED: 'controller_not_imported'
};

/*
 * Fallback config values
*/
export const MAX_NOMINATIONS = 16;
export const BONDING_DURATION = 28;
export const SESSIONS_PER_ERA = 6;
export const MAX_NOMINATOR_REWARDED_PER_VALIDATOR = 256;

/*
 * Third party API keys and endpoints
*/

export const API_SUBSCAN_KEY = 'd37149339f64775155a82a53f4253b27';

export const ENDPOINT_PRICE = 'https://api.binance.com/api/v3';

export const API_ENDPOINTS = {
  priceChange: `${ENDPOINT_PRICE}/ticker/24hr?symbol=`,
  subscanRewardSlash: '/api/scan/account/reward_slash',
};

export const SUBSCAN_ENABLED = true;