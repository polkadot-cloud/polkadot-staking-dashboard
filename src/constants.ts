/*
 * SVGs 
*/
import { ReactComponent as PolkadotLogoSVG } from './img/polkadot_icon.svg';
import { ReactComponent as WestendLogoSVG } from './img/westend_icon.svg';

/*
 * Global Constants 
*/
export const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';
export const WESTEND_ENDPOINT = 'wss://westend-rpc.polkadot.io';

export const DEFAULT_NETWORK = 'polkadot';
export const ACTIVE_NETWORK = 'polkadot';

export const NODE_ENDPOINTS: any = {
  polkadot: {
    name: 'Polkadot',
    endpoint: 'wss://rpc.polkadot.io',
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
    unit: 'WND',
    icon: WestendLogoSVG,
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    }
  },
  _: {}
}

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
export const API_ENDPOINTS = {
  priceChange: 'https://api.binance.com/api/v3/ticker/24hr?symbol=',
}