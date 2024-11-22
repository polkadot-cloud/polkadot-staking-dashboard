// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkName, SystemChainId } from 'types';
import type { UnsafeApi } from 'polkadot-api';

export interface APIConfig {
  type: ConnectionType;
  rpcEndpoint: string;
}

export interface APIEventDetail {
  status: EventApiStatus;
  network: NetworkName | SystemChainId;
  chainType: ApiChainType;
  connectionType: ConnectionType;
  rpcEndpoint: string;
  err?: string;
}

export interface PapiChainSpec {
  genesisHash: string;
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
  authoringVersion: number;
  implName: string;
  implVersion: number;
  specName: string;
  specVersion: number;
  stateVersion: number;
  transactionVersion: number;
}

export type PapiReadyEvent = PapiChainSpec & {
  network: NetworkName | SystemChainId;
  chainType: string;
};

export type PapiApi = UnsafeApi<unknown>;

export type ConnectionType = 'ws' | 'sc';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventApiStatus = ApiStatus | 'error';

export type ApiChainType = 'relay' | 'system';
