// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, MaybeAddress, ProviderType } from 'types'

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

export interface PapiChainSpec {
  genesisHash: string
  ss58Format: number
  tokenDecimals: number
  tokenSymbol: string
  authoringVersion: number
  implName: string
  implVersion: number
  specName: string
  specVersion: number
  stateVersion: number
  transactionVersion: number
}

export type PapiReadyEvent = PapiChainSpec & {
  network: ChainId
  chainType: string
}

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready'

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
