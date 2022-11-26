// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WellKnownChain } from '@polkadot/rpc-provider/substrate-connect';
import { DefaultParams } from 'consts';
import { ReactComponent as KusamaIconSVG } from 'img/kusama_icon.svg';
import { ReactComponent as KusamaInlineSVG } from 'img/kusama_inline.svg';
import { ReactComponent as KusamaLogoSVG } from 'img/kusama_logo.svg';
import { ReactComponent as PolkadotIconSVG } from 'img/polkadot_icon.svg';
import { ReactComponent as PolkadotInlineSVG } from 'img/polkadot_inline.svg';
import { ReactComponent as PolkadotLogoSVG } from 'img/polkadot_logo.svg';
import { ReactComponent as WestendIconSVG } from 'img/westend_icon.svg';
import { ReactComponent as WestendInlineSVG } from 'img/westend_inline.svg';
import { ReactComponent as WestendLogoSVG } from 'img/westend_logo.svg';
import { Networks } from 'types';

/*
 * Network Configuration
 */
export const NETWORKS: Networks = {
  polkadot: {
    name: 'Polkadot',
    endpoints: {
      rpc: 'wss://apps-rpc.polkadot.io',
      lightClient: WellKnownChain.polkadot,
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
      stroke: {
        light: 'rgb(211, 48, 121)',
        dark: 'rgb(211, 48, 121)',
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
  kusama: {
    name: 'Kusama',
    endpoints: {
      rpc: 'wss://kusama-rpc.polkadot.io',
      lightClient: WellKnownChain.ksmcc3,
    },
    colors: {
      primary: {
        light: '#201f37',
        dark: '#6c6b80',
      },
      secondary: {
        light: '#999',
        dark: '#AAA',
      },
      stroke: {
        light: '#4c4b63',
        dark: '#d1d1db',
      },
      transparent: {
        light: 'rgb(51,51,51,0.05)',
        dark: 'rgb(102,102,102, 0.05)',
      },
    },
    subscanEndpoint: 'https://kusama.api.subscan.io',
    unit: 'KSM',
    units: 12,
    ss58: 2,
    brand: {
      icon: KusamaIconSVG,
      logo: {
        svg: KusamaLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: KusamaInlineSVG,
        size: '1.55rem',
      },
    },
    api: {
      unit: 'KSM',
      priceTicker: 'KSMUSDT',
    },
    params: {
      ...DefaultParams,
      auctionAdjust: 0.3 / 60,
      auctionMax: 60,
      stakeTarget: 0.75,
    },
  },
  westend: {
    name: 'Westend',
    endpoints: {
      rpc: 'wss://westend-rpc.polkadot.io',
      lightClient: WellKnownChain.westend2,
    },
    colors: {
      primary: {
        light: '#da4e71',
        dark: '#da4e71',
      },
      secondary: {
        light: '#e37c44',
        dark: '#e37c44',
      },
      stroke: {
        light: '#da4e71',
        dark: '#da4e71',
      },
      transparent: {
        light: 'rgb(218, 78, 113, 0.05)',
        dark: 'rgb(218, 78, 113, 0.05)',
      },
    },
    subscanEndpoint: 'https://westend.api.subscan.io',
    unit: 'WND',
    units: 12,
    ss58: 42,
    brand: {
      icon: WestendIconSVG,
      logo: {
        svg: WestendLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: WestendInlineSVG,
        size: '1.15rem',
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
};
