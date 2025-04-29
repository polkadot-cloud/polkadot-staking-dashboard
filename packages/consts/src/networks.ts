// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, Networks, SystemChain } from 'types'

export const DefaultNetwork: NetworkId = 'polkadot'

export const NetworkList: Networks = {
  polkadot: {
    name: 'polkadot',
    endpoints: {
      lightClientKey: 'polkadot',
      lightClient: async () =>
        await import('@substrate/connect-known-chains/polkadot'),
      defaultRpc: 'IBP-GeoDNS1',
      rpc: {
        'Automata 1RPC': 'wss://1rpc.io/dot',
        Dwellir: 'wss://polkadot-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
        LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
        Stakeworld: 'wss://dot-rpc.stakeworld.io',
      },
    },
    unit: 'DOT',
    units: 10,
    ss58: 0,
    defaultFeeReserve: 1000000000n,
  },
  kusama: {
    name: 'kusama',
    endpoints: {
      lightClientKey: 'ksmcc3',
      lightClient: async () =>
        await import('@substrate/connect-known-chains/ksmcc3'),
      defaultRpc: 'IBP-GeoDNS1',
      rpc: {
        'Automata 1RPC': 'wss://1rpc.io/ksm',
        Dwellir: 'wss://kusama-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/kusama',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/kusama',
        LuckyFriday: 'wss://rpc-kusama.luckyfriday.io',
        Stakeworld: 'wss://ksm-rpc.stakeworld.io',
      },
    },
    unit: 'KSM',
    units: 12,
    ss58: 2,
    defaultFeeReserve: 50000000000n,
  },
  westend: {
    name: 'westend',
    endpoints: {
      lightClientKey: 'westend2',
      lightClient: async () =>
        await import('@substrate/connect-known-chains/westend2'),
      defaultRpc: 'IBP-GeoDNS1',
      rpc: {
        Dwellir: 'wss://westend-rpc.dwellir.com',
        'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
        'IBP-GeoDNS1': 'wss://rpc.ibp.network/westend',
        'IBP-GeoDNS2': 'wss://rpc.dotters.network/westend',
        LuckyFriday: 'wss://rpc-westend.luckyfriday.io',
        Stakeworld: 'wss://wnd-rpc.stakeworld.io',
      },
    },
    unit: 'WND',
    units: 12,
    ss58: 42,
    defaultFeeReserve: 100000000000n,
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
        await import('@substrate/connect-known-chains/polkadot_people'),
      defaultRpc: 'IBP1',
      rpc: {
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
        await import('@substrate/connect-known-chains/ksmcc3_people'),
      defaultRpc: 'IBP1',
      rpc: {
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
        await import('@substrate/connect-known-chains/westend_people'),
      defaultRpc: 'IBP1',
      rpc: {
        IBP1: 'wss://sys.ibp.network/people-westend',
        IBP2: 'wss://people-westend.dotters.network',
      },
    },
    relayChain: 'westend',
  },
}
