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
      rpc: 'wss://mainnet.creditcoin.network/ws',
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
        light: '#9fccaa',
        dark: '#9fccaa',
      },
      secondary: {
        light: '#9fccaa',
        dark: '#9fccaa',
      },
      stroke: {
        light: '#9fccaa',
        dark: '#9fccaa',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
      pending: {
        light: '#9fccaa',
        dark: '#9fccaa',
      },
    },
    subscanEndpoint: 'https://subscan-mainnet.creditcoin.network/',
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
        light: '#9fccaa',
        dark: '#9fccaa',
      },
      secondary: {
        light: '#9fccaa',
        dark: '#9fccaa',
      },
      stroke: {
        light: '#9fccaa',
        dark: '#9fccaa',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
      pending: {
        light: '#9fccaa',
        dark: '#9fccaa',
      },
    },
    subscanEndpoint: 'https://subscan-testnet.creditcoin.network/',
  },
  // creditcoinDev: {
  //   name: 'creditcoinDev',
  //   endpoints: {
  //     rpc: 'wss://rpc.devnet.creditcoin.network/ws',
  //     lightClient: null,
  //   },
  //   namespace: '09573a3526818a8ecd6eb92f60f1175d',
  //   api: {
  //     unit: 'CTC',
  //     priceTicker: 'CTCUSDT',
  //   },
  //   params: {
  //     ...DefaultParams,
  //   },
  //   ss58: 42,
  //   unit: 'CTC',
  //   units: 18,
  //   brand: {
  //     icon: CreditcoinIconSVG,
  //     logo: {
  //       svg: CreditcoinLogoSVG,
  //       width: '7.2em',
  //     },
  //     inline: {
  //       svg: CreditcoinIconSVG,
  //       size: '1.05em',
  //     },
  //   },
  //   colors: {
  //     primary: {
  //       light: '#9fccaa',
  //       dark: '#9fccaa',
  //     },
  //     secondary: {
  //       light: '#9fccaa',
  //       dark: '#9fccaa',
  //     },
  //     stroke: {
  //       light: '#9fccaa',
  //       dark: '#9fccaa',
  //     },
  //     transparent: {
  //       light: 'rgb(211, 48, 121, 0.05)',
  //       dark: 'rgb(211, 48, 121, 0.05)',
  //     },
  //     pending: {
  //       light: '#9fccaa',
  //       dark: '#9fccaa',
  //     },
  //   },
  //   subscanEndpoint: 'http://127.0.0.1:4399',
  // },
};
