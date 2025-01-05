// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import KusamaIconSVG from 'assets/svg/chains/kusamaIcon.svg?react'
import KusamaInlineSVG from 'assets/svg/chains/kusamaInline.svg?react'
import PolkadotIconSVG from 'assets/svg/chains/polkadotIcon.svg?react'
import PolkadotInlineSVG from 'assets/svg/chains/polkadotInline.svg?react'
import WestendIconSVG from 'assets/svg/chains/westendIcon.svg?react'
import WestendInlineSVG from 'assets/svg/chains/westendInline.svg?react'
import PolkadotTokenSVG from 'assets/svg/token/dot.svg?react'
import KusamaTokenSVG from 'assets/svg/token/ksm.svg?react'
import WestendTokenSVG from 'assets/svg/token/wnd.svg?react'
import BigNumber from 'bignumber.js'
import type { Networks, SystemChain } from 'common-types'

export const NetworkList: Networks = {
  polkadot: {
    name: 'polkadot',
    endpoints: {
      lightClientKey: 'polkadot',
      lightClient: async () => await import('polkadot-api/chains/polkadot'),
      defaultRpcEndpoint: 'IBP-GeoDNS1',
      rpcEndpoints: {
        'Automata 1RPC': 'wss://1rpc.io/dot',
        Dwellir: 'wss://polkadot-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
        LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
        RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://dot-rpc.stakeworld.io',
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
    unit: 'DOT',
    units: 10,
    ss58: 0,
    brand: {
      icon: PolkadotIconSVG,
      token: PolkadotTokenSVG,
      inline: {
        svg: PolkadotInlineSVG,
        size: '1.05em',
      },
    },
    api: {
      unit: 'DOT',
    },
    defaultFeeReserve: 0.1,
    maxExposurePageSize: new BigNumber(512),
  },
  kusama: {
    name: 'kusama',
    endpoints: {
      lightClientKey: 'ksmcc3',
      lightClient: async () => await import('polkadot-api/chains/ksmcc3'),
      defaultRpcEndpoint: 'IBP-GeoDNS1',
      rpcEndpoints: {
        'Automata 1RPC': 'wss://1rpc.io/ksm',
        Dwellir: 'wss://kusama-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/kusama',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/kusama',
        LuckyFriday: 'wss://rpc-kusama.luckyfriday.io',
        RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://ksm-rpc.stakeworld.io',
      },
    },
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
    unit: 'KSM',
    units: 12,
    ss58: 2,
    brand: {
      icon: KusamaIconSVG,
      token: KusamaTokenSVG,
      inline: {
        svg: KusamaInlineSVG,
        size: '1.35em',
      },
    },
    api: {
      unit: 'KSM',
    },
    defaultFeeReserve: 0.05,
    maxExposurePageSize: new BigNumber(512),
  },
  westend: {
    name: 'westend',
    endpoints: {
      lightClientKey: 'westend2',
      lightClient: async () => await import('polkadot-api/chains/westend2'),
      defaultRpcEndpoint: 'IBP-GeoDNS1',
      rpcEndpoints: {
        Dwellir: 'wss://westend-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/westend',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/westend',
        LuckyFriday: 'wss://rpc-westend.luckyfriday.io',
        RadiumBlock: 'wss://westend.public.curie.radiumblock.co/ws',
        Stakeworld: 'wss://wnd-rpc.stakeworld.io',
      },
    },
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
    unit: 'WND',
    units: 12,
    ss58: 42,
    brand: {
      icon: WestendIconSVG,
      token: WestendTokenSVG,
      inline: {
        svg: WestendInlineSVG,
        size: '0.96em',
      },
    },
    api: {
      unit: 'DOT',
    },
    defaultFeeReserve: 0.1,
    maxExposurePageSize: new BigNumber(64),
  },
}

export const SystemChainList: Record<string, SystemChain> = {
  'people-polkadot': {
    name: 'people-polkadot',
    ss58: 0,
    units: 10,
    unit: 'DOT',
    endpoints: {
      lightClientKey: 'polkadot_people',
      lightClient: async () =>
        await import('polkadot-api/chains/polkadot_people'),
      rpcEndpoints: {
        IBP1: 'wss://sys.ibp.network/people-polkadot',
        IBP2: 'wss://people-polkadot.dotters.network',
      },
    },
    relayChain: 'polkadot',
  },
  'people-kusama': {
    name: 'people-kusama',
    ss58: 2,
    units: 12,
    unit: 'KSM',
    endpoints: {
      lightClientKey: 'ksmcc3_people',
      lightClient: async () =>
        await import('polkadot-api/chains/ksmcc3_people'),
      rpcEndpoints: {
        IBP1: 'wss://sys.ibp.network/people-kusama',
        IBP2: 'wss://people-kusama.dotters.network',
      },
    },
    relayChain: 'kusama',
  },
  'people-westend': {
    name: 'people-westend',
    ss58: 42,
    units: 12,
    unit: 'WND',
    endpoints: {
      lightClientKey: 'westend2_people',
      lightClient: async () =>
        await import('polkadot-api/chains/westend2_people'),
      rpcEndpoints: {
        IBP1: 'wss://sys.ibp.network/people-westend',
        IBP2: 'wss://people-westend.dotters.network',
      },
    },
    relayChain: 'westend',
  },
}
