// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiStatus, ChainId, MaybeAddress, ProviderType } from 'types'

export interface APIConfig {
  type: ProviderType
  rpcEndpoint: string
}

export interface APIEventDetail {
  status: EventApiStatus
  network: ChainId
  chainType: ApiChainType
  providerType: ProviderType
  rpcEndpoint: string
  err?: string
}

export type PapiReadyEvent = {
  chainType: string
}

export type EventApiStatus = ApiStatus | 'error'

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
