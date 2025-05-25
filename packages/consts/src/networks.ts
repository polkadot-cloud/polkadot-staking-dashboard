// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, Networks, SystemChain } from 'types'

// The default network to use when no network is specified
export const DefaultNetwork: NetworkId = 'polkadot'

// Networks that are disabled in production
export const ProductionDisabledNetworks: NetworkId[] = ['westend']

// All supported networks
export const NetworkList: Networks = {
  polkadot: {
    name: 'polkadot',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/polkadot'),
      rpc: {
        'Automata 1RPC': 'wss://1rpc.io/dot',
        Dwellir: 'wss://polkadot-rpc.dwellir.com',
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
    meta: {
      defaultBalances: 'polkadot',
      defaultTx: 'polkadot',
    },
  },
  kusama: {
    name: 'kusama',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/ksmcc3'),
      rpc: {
        'Automata 1RPC': 'wss://1rpc.io/ksm',
        Dwellir: 'wss://kusama-rpc.dwellir.com',
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
    meta: {
      defaultBalances: 'kusama',
      defaultTx: 'kusama',
    },
  },
  westend: {
    name: 'westend',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/westend2'),
      rpc: {
        Dwellir: 'wss://westend-rpc.dwellir.com',
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
    meta: {
      defaultBalances: 'westmint',
      defaultTx: 'westmint',
    },
  },
}

// All supported system chains
export const SystemChainList: Record<string, SystemChain> = {
  'people-polkadot': {
    name: 'people-polkadot',
    ss58: 0,
    units: 10,
    unit: 'DOT',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/polkadot_people'),
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
      lightClient: async () =>
        await import('@substrate/connect-known-chains/ksmcc3_people'),
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
      lightClient: async () =>
        await import('@substrate/connect-known-chains/westend_people'),
      rpc: {
        IBP1: 'wss://sys.ibp.network/people-westend',
        IBP2: 'wss://people-westend.dotters.network',
      },
    },
    relayChain: 'westend',
  },
  statemint: {
    name: 'statemint',
    ss58: 0,
    units: 10,
    unit: 'DOT',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/polkadot_asset_hub'),
      rpc: {
        'Lucky Friday': 'wss://rpc-asset-hub-polkadot.luckyfriday.io',
        Parity: 'wss://polkadot-asset-hub-rpc.polkadot.io',
        StakeWorld: 'wss://dot-rpc.stakeworld.io/assethub',
        Dwellir: 'wss://asset-hub-polkadot-rpc.dwellir.com',
        IBP1: 'wss://sys.ibp.network/asset-hub-polkadot',
        IBP2: 'wss://asset-hub-polkadot.dotters.network',
      },
    },
    relayChain: 'polkadot',
  },
  statemine: {
    name: 'statemine',
    ss58: 2,
    units: 12,
    unit: 'KSM',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/ksmcc3_asset_hub'),
      rpc: {
        'Lucky Friday': 'wss://rpc-asset-hub-kusama.luckyfriday.io',
        Parity: 'wss://kusama-asset-hub-rpc.polkadot.io',
        IBP1: 'wss://sys.ibp.network/asset-hub-kusama',
        IBP2: 'wss://asset-hub-kusama.dotters.network',
      },
    },
    relayChain: 'kusama',
  },
  westmint: {
    name: 'westmint',
    ss58: 42,
    units: 12,
    unit: 'WND',
    endpoints: {
      lightClient: async () =>
        await import('@substrate/connect-known-chains/westend2_asset_hub'),
      rpc: {
        Parity: 'wss://westend-asset-hub-rpc.polkadot.io',
        Dwellir: 'wss://asset-hub-westend-rpc.dwellir.com',
        IBP1: 'wss://sys.ibp.network/asset-hub-westend',
        IBP2: 'wss://asset-hub-westend.dotters.network',
        'Permanence DAO EU': 'wss://asset-hub-westend.rpc.permanence.io',
      },
    },
    relayChain: 'westend',
  },
}
