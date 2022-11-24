// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultParams } from 'consts';
import { ReactComponent as PolkadotIconSVG } from 'img/polkadot_icon.svg';
import { ReactComponent as PolkadotInlineSVG } from 'img/polkadot_inline.svg';
import { ReactComponent as PolkadotLogoSVG } from 'img/polkadot_logo.svg';
import { Networks } from 'types';

/*
 * Network Configuration
 */
export const NETWORKS: Networks = {
  polkadot: {
    name: 'Polkadot',
    endpoints: {
      rpc: 'wss://apps-rpc.polkadot.io',
      lightClient: null,
    },
    colors: {
      primary: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
      },
      secondary: {
        light: '#e474bc',
        dark: '#e474bc',
      },
      transparent: {
        light: 'rgb(211, 48, 121, 0.05)',
        dark: 'rgb(211, 48, 121, 0.05)',
      },
    },
    subscanEndpoint: 'https://polkadot.api.subscan.io',
    unit: 'DOT',
    units: 10,
    ss58: 0,
    brand: {
      icon: PolkadotIconSVG,
      logo: {
        svg: PolkadotLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: PolkadotInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.75,
    },
  },
  alephzerotestnet: {
    name: 'alephzerotestnet',
    endpoints: {
      rpc: 'wss://ws.test.azero.dev',
      lightClient: null,
    },
    colors: {
      primary: {
        light: 'rgb(0, 204, 171)',
        dark: 'rgb(0, 204, 171)',
      },
      secondary: {
        light: 'black',
        dark: 'black',
      },
      transparent: {
        light: 'rgb(0, 204, 171, 0.05)',
        dark: 'rgb(0, 204, 171, 0.05)',
      },
    },
    subscanEndpoint: 'https://alephzero.api.subscan.io',
    unit: 'TZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: PolkadotIconSVG,
      logo: {
        svg: PolkadotLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: PolkadotInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'TAZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
    },
  },
};
