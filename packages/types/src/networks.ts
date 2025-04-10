// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type ChainId = NetworkId | SystemChainId

export type NetworkId = 'polkadot' | 'kusama' | 'westend'

export type SystemChainId =
  | 'people-polkadot'
  | 'people-kusama'
  | 'people-westend'
