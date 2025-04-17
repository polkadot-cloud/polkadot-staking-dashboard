// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress, ProviderType } from 'types'

export interface APIConfig {
  type: ProviderType
  rpcEndpoint: string
}

export type PapiReadyEvent = {
  chainType: string
}

export type ApiChainType = 'relay' | 'system'

export type TxSubmissionItem = {
  uid: number
  tag?: string
  fee: bigint
  from: MaybeAddress
  submitted: boolean
  pending: boolean
}

export interface EraRewardPoints {
  total: number
  individual: Record<string, [string, number]>
}

export interface EraRewardPointsEvent {
  eraRewardPoints: EraRewardPoints
  eraHigh: number
}
