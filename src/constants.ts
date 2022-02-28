/*
 * Global Constants */

export const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';
export const WESTEND_ENDPOINT = 'wss://westend-rpc.polkadot.io';

export const ACTIVE_NETWORK = 'polkadot';

export const NODE_ENDPOINTS = {
  polkadot: 'wss://rpc.polkadot.io',
  westend: 'wss://westend-rpc.polkadot.io',
}

export const ACTIVE_ENDPOINT = NODE_ENDPOINTS[ACTIVE_NETWORK];

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
export const INTERFACE_MINIMUM_HEIGHT: number = 400;
export const SIDE_MENU_INTERFACE_WIDTH: number = 200;
export const MAX_ASSISTANT_INTERFACE_WIDTH: number = 500;

export const ENDPOINT_PRICE = 'https://api.binance.com/api/v3/';
export const ENDPOINTS = {
  priceChange: 'https://api.binance.com/api/v3/ticker/24hr?symbol=DOTUSDT',
}