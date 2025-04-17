// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainProperties } from 'dedot/types/json-rpc'
import type { HexString } from 'dedot/utils'
import type { FunctionComponent, SVGProps } from 'react'

export type ChainId = NetworkId | SystemChainId

export type NetworkId = 'polkadot' | 'kusama' | 'westend'

export type SystemChainId =
  | 'people-polkadot'
  | 'people-kusama'
  | 'people-westend'

export type ProviderType = 'ws' | 'sc'

export type Networks = Record<string, Network>

export type RpcEndpoints = Record<string, string>

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready'

export interface ChainSpec {
  genesisHash: HexString
  properties: ChainProperties
  existentialDeposit: bigint
  version: ChainSpecVersion
}

export interface ChainSpecVersion {
  specName: string
  implName: string
  authoringVersion: number
  specVersion: number
  implVersion: number
  apis: (readonly [`0x${string}`, number])[]
  transactionVersion: number
  stateVersion: number
}

export interface NetworkConfig {
  network: NetworkId
  rpcEndpoints: Record<string, string>
  providerType: ProviderType
}

export interface Network {
  name: NetworkId
  endpoints: {
    lightClientKey: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lightClient: () => Promise<any>
    defaultRpc: string
    rpc: Record<string, string>
  }
  unit: string
  units: number
  ss58: number
  defaultFeeReserve: number
}

export interface SystemChain {
  name: string
  ss58: number
  units: number
  unit: string
  endpoints: {
    lightClientKey: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lightClient: () => Promise<any>
    defaultRpc: string
    rpc: Record<string, string>
  }
  relayChain: NetworkId
}

export interface ChainIcons {
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >
  token: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >
  inline: {
    svg: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >
    size: string
  }
}
