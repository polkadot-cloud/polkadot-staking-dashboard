// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WellKnownChain } from '@polkadot/rpc-provider/substrate-connect';
import { Networks } from 'types';
import { ReactComponent as PolkadotLogoSVG } from 'img/polkadot_logo.svg';
import { ReactComponent as PolkadotIconSVG } from 'img/polkadot_icon.svg';
import { ReactComponent as KusamaLogoSVG } from 'img/kusama_logo.svg';
import { ReactComponent as KusamaIconSVG } from 'img/kusama_icon.svg';
import { ReactComponent as WestendLogoSVG } from 'img/westend_logo.svg';
import { ReactComponent as WestendIconSVG } from 'img/westend_icon.svg';

/*
 * Network Configuration
 */
export const NETWORKS: Networks = {
  polkadot: {
    name: 'Polkadot',
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
        light: 'rgb(211, 48, 121, 0.2)',
        dark: 'rgb(211, 48, 121, 0.2)',
      },
    },
    lightClientEndpoint: WellKnownChain.polkadot,
    endpoint: 'wss://rpc.polkadot.io',
    subscanEndpoint: 'https://polkadot.api.subscan.io',
    unit: 'DOT',
    units: 10,
    ss58: 0,
    icon: PolkadotIconSVG,
    logo: {
      svg: PolkadotLogoSVG,
      width: '8.5rem',
    },
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
      primary: {
        light: '#333',
        dark: '#666',
      },
      secondary: {
        light: '#888',
        dark: '#888',
      },
      transparent: {
        light: 'rgb(51,51,51,0.2)',
        dark: 'rgb(102,102,102, 0.2)',
      },
    },
    lightClientEndpoint: WellKnownChain.ksmcc3,
    endpoint: 'wss://kusama-rpc.polkadot.io',
    subscanEndpoint: 'https://kusama.api.subscan.io',
    unit: 'KSM',
    units: 12,
    ss58: 2,
    icon: KusamaIconSVG,
    logo: {
      svg: KusamaLogoSVG,
      width: '7rem',
    },
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
      primary: {
        light: '#EC6E79',
        dark: '#EC6E79',
      },
      secondary: {
        light: '#Ec8f6e',
        dark: '#Ec8f6e',
      },
      transparent: {
        light: 'rgb(236,110,121,0.2)',
        dark: 'rgb(236,110,121, 0.2)',
      },
    },
    lightClientEndpoint: WellKnownChain.westend2,
    endpoint: 'wss://westend-rpc.polkadot.io',
    subscanEndpoint: 'https://westend.api.subscan.io',
    unit: 'WND',
    units: 12,
    ss58: 42,
    icon: WestendIconSVG,
    logo: {
      svg: WestendLogoSVG,
      width: '8rem',
    },
    api: {
      unit: 'DOT',
      priceTicker: 'DOTUSDT',
    },
    features: {
      pools: true,
    },
  },
};
