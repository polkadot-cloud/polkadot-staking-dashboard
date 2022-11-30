// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, BN_MILLION } from '@polkadot/util';
import { DefaultParams } from 'consts';
import { ReactComponent as AzeroIconSVG } from 'img/a0_icon.svg';
import { ReactComponent as AzeroInlineSVG } from 'img/a0_inline.svg';
import { ReactComponent as AzeroLogoSVG } from 'img/a0_logo.svg';
import { Networks } from 'types';

/*
 * Network Configuration
 */
export const NETWORKS: Networks = {
  alephzero: {
    name: 'Aleph Zero',
    endpoints: {
      rpc: 'wss://ws.azero.dev',
      lightClient: null,
    },
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#4c4b63',
        dark: '#d1d1db',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
    },
    subscanEndpoint: 'https://alephzero.api.subscan.io',
    unit: 'AZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'AZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
  },
  alephzerotestnet: {
    name: 'Aleph Zero Testnet',
    endpoints: {
      rpc: 'wss://ws.test.azero.dev',
      lightClient: null,
    },
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#4c4b63',
        dark: '#d1d1db',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
    },
    subscanEndpoint: 'https://alephzero.api.subscan.io',
    unit: 'TZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'TZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
  },
};
