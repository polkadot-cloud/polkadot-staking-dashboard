// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataLookup } from '@polkadot-api/metadata-builders';
import type { AnyJson } from '@w3ux/types';
import type { NetworkName, SystemChainId } from 'types';

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

export type ConnectionType = 'ws' | 'sc';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventApiStatus = ApiStatus | 'error';

export type ApiChainType = 'relay' | 'system';

// NOTE: Replace with actual PAPI client interface when available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PapiObservableClient = any;

// NOTE: Replace with actual PAPI builder interface when available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PapiDynamicBuilder = any;

export interface APIChainSpec {
  chain: string | null;
  version: APIChainSpecVersion;
  // ss58Prefix: number; // TODO: Derive and add back.
  metadata: MetadataLookup;
  consts: AnyJson;
}

export interface APIChainSpecVersion {
  apis: AnyJson;
  authoringVersion: number;
  implName: string;
  implVersion: number;
  specName: NetworkName | SystemChainId;
  specVersion: number;
  stateVersion: number;
  transactionVersion: number;
}
