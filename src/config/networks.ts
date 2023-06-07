// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultParams } from 'consts';
import { ReactComponent as CreditcoinIconSVG } from 'img/ic_creditcoin.svg';
import { ReactComponent as CreditcoinLogoSVG } from 'img/logo_creditcoin.svg';

import type { Networks } from 'types';

export const NetworkList: Networks = {
  creditcoin: {
    name: 'creditcoin',
    endpoints: {
      rpc: 'wss://rpc.mainnet.creditcoin.network/ws',
      lightClient: null,
    },
    namespace: '09573a3526818a8ecd6eb92f60f1175d',
    api: {
      unit: 'CTC',
      priceTicker: 'CTCUSDT',
    },
    params: {
      ...DefaultParams,
    },
    ss58: 42,
    unit: 'CTC',
    units: 18,
    brand: {
      icon: CreditcoinIconSVG,
      logo: {
        svg: CreditcoinLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: CreditcoinIconSVG,
        size: '1.05em',
      },
    },
    colors: {
      primary: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      secondary: {
        light: '#552bbf',
        dark: '#6d39ee',
      },
      stroke: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
      pending: {
        light: 'rgb(211, 48, 121, 0.33)',
        dark: 'rgb(211, 48, 121, 0.33)',
      },
    },
    subscanEndpoint: 'http://127.0.0.1:4399',
  },
  creditcoinTest: {
    name: 'creditcoinTest',
    endpoints: {
      rpc: 'wss://rpc.testnet.creditcoin.network/ws',
      lightClient: null,
    },
    namespace: '09573a3526818a8ecd6eb92f60f1175d',
    api: {
      unit: 'CTC',
      priceTicker: 'CTCUSDT',
    },
    params: {
      ...DefaultParams,
    },
    ss58: 42,
    unit: 'CTC',
    units: 18,
    brand: {
      icon: CreditcoinIconSVG,
      logo: {
        svg: CreditcoinLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: CreditcoinIconSVG,
        size: '1.05em',
      },
    },
    colors: {
      primary: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      secondary: {
        light: '#552bbf',
        dark: '#6d39ee',
      },
      stroke: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
      pending: {
        light: 'rgb(211, 48, 121, 0.33)',
        dark: 'rgb(211, 48, 121, 0.33)',
      },
    },
    subscanEndpoint: 'https://subscan-testnet.creditcoin.network/',
  },
  creditcoinDev: {
    name: 'creditcoinDev',
    endpoints: {
      rpc: 'wss://rpc.devnet.creditcoin.network/ws',
      lightClient: null,
    },
    namespace: '09573a3526818a8ecd6eb92f60f1175d',
    api: {
      unit: 'CTC',
      priceTicker: 'CTCUSDT',
    },
    params: {
      ...DefaultParams,
    },
    ss58: 42,
    unit: 'CTC',
    units: 18,
    brand: {
      icon: CreditcoinIconSVG,
      logo: {
        svg: CreditcoinLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: CreditcoinIconSVG,
        size: '1.05em',
      },
    },
    colors: {
      primary: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      secondary: {
        light: '#552bbf',
        dark: '#6d39ee',
      },
      stroke: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
      pending: {
        light: 'rgb(211, 48, 121, 0.33)',
        dark: 'rgb(211, 48, 121, 0.33)',
      },
    },
    subscanEndpoint: 'http://127.0.0.1:4399',
  },
};
