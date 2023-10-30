// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { WellKnownChain } from '@substrate/connect';
import { DefaultParams } from 'consts';
import KusamaIconSVG from 'img/kusama_icon.svg?react';
import KusamaInlineSVG from 'img/kusama_inline.svg?react';
import KusamaLogoSVG from 'img/kusama_logo.svg?react';
import PolkadotIconSVG from 'img/polkadot_icon.svg?react';
import PolkadotInlineSVG from 'img/polkadot_inline.svg?react';
import PolkadotLogoSVG from 'img/polkadot_logo.svg?react';
import WestendIconSVG from 'img/westend_icon.svg?react';
import WestendInlineSVG from 'img/westend_inline.svg?react';
import WestendLogoSVG from 'img/westend_logo.svg?react';
import PolkadotTokenSVG from 'config/tokens/svg/DOT.svg?react';
import KusamaTokenSVG from 'config/tokens/svg/KSM.svg?react';
import WestendTokenSVG from 'config/tokens/svg/WND.svg?react';

import type { Networks } from 'types';

export const NetworkList: Networks = {
  polkadot: {
    name: 'polkadot',
    endpoints: {
      lightClient: WellKnownChain.polkadot,
      defaultRpcEndpoint: 'Parity',
      rpcEndpoints: {
        'Automata 1RPC': 'wss://1rpc.io/dot',
        Dwellir: 'wss://polkadot-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
        LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
        OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
        RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://dot-rpc.stakeworld.io',
        Parity: 'wss://apps-rpc.polkadot.io',
      },
    },
    namespace: '91b171bb158e2d3848fa23a9f1c25182',
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
    subscanEndpoint: 'https://polkadot.api.subscan.io',
    unit: 'DOT',
    units: 10,
    ss58: 0,
    brand: {
      icon: PolkadotIconSVG,
      token: PolkadotTokenSVG,
      logo: {
        svg: PolkadotLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: PolkadotInlineSVG,
        size: '1.05em',
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
    defaultFeeReserve: 0.1,
  },
  kusama: {
    name: 'kusama',
    endpoints: {
      lightClient: WellKnownChain.ksmcc3,
      defaultRpcEndpoint: 'Parity',
      rpcEndpoints: {
        'Automata 1RPC': 'wss://1rpc.io/ksm',
        Dwellir: 'wss://kusama-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/kusama',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/kusama',
        LuckyFriday: 'wss://rpc-kusama.luckyfriday.io',
        OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
        RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://ksm-rpc.stakeworld.io',
        Parity: 'wss://kusama-rpc.polkadot.io',
      },
    },
    namespace: 'b0a8d493285c2df73290dfb7e61f870f',
    colors: {
      primary: {
        light: 'rgb(31, 41, 55)',
        dark: 'rgb(126, 131, 141)',
      },
      secondary: {
        light: 'rgb(31, 41, 55)',
        dark: 'rgb(141, 144, 150)',
      },
      stroke: {
        light: '#4c4b63',
        dark: '#d1d1db',
      },
      transparent: {
        light: 'rgb(51,51,51,0.05)',
        dark: 'rgb(102,102,102, 0.05)',
      },
      pending: {
        light: 'rgb(51,51,51,0.33)',
        dark: 'rgb(102,102,102, 0.33)',
      },
    },
    subscanEndpoint: 'https://kusama.api.subscan.io',
    unit: 'KSM',
    units: 12,
    ss58: 2,
    brand: {
      icon: KusamaIconSVG,
      token: KusamaTokenSVG,
      logo: {
        svg: KusamaLogoSVG,
        width: '7.2em',
      },
      inline: {
        svg: KusamaInlineSVG,
        size: '1.35em',
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
    defaultFeeReserve: 0.05,
  },
  westend: {
    name: 'westend',
    endpoints: {
      lightClient: WellKnownChain.westend2,
      defaultRpcEndpoint: 'Parity',
      rpcEndpoints: {
        Dwellir: 'wss://westend-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/westend',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/westend',
        LuckyFriday: 'wss://rpc-westend.luckyfriday.io',
        OnFinality: 'wss://westend.api.onfinality.io/public-ws',
        RadiumBlock: 'wss://westend.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://wnd-rpc.stakeworld.io',
        Parity: 'wss://westend-rpc.polkadot.io',
      },
    },
    namespace: 'e143f23803ac50e8f6f8e62695d1ce9e',
    colors: {
      primary: {
        light: '#da4e71',
        dark: '#da4e71',
      },
      secondary: {
        light: '#de6a50',
        dark: '#d7674e',
      },
      stroke: {
        light: '#da4e71',
        dark: '#da4e71',
      },
      transparent: {
        light: 'rgb(218, 78, 113, 0.05)',
        dark: 'rgb(218, 78, 113, 0.05)',
      },
      pending: {
        light: 'rgb(218, 78, 113, 0.33)',
        dark: 'rgb(218, 78, 113, 0.33)',
      },
    },
    subscanEndpoint: 'https://westend.api.subscan.io',
    unit: 'WND',
    units: 12,
    ss58: 42,
    brand: {
      icon: WestendIconSVG,
      token: WestendTokenSVG,
      logo: {
        svg: WestendLogoSVG,
        width: '7.1em',
      },
      inline: {
        svg: WestendInlineSVG,
        size: '0.96em',
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
    defaultFeeReserve: 0.1,
  },
};
