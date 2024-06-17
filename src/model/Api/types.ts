// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type * as ScType from '@substrate/connect';
import type { NetworkName } from 'types';

export interface APIConfig {
  type: ConnectionType;
  rpcEndpoint: string;
}

export interface APIEventDetail {
  status: EventApiStatus;
  network: NetworkName;
  type: ConnectionType;
  rpcEndpoint: string;
  err?: string;
}

export interface SubstrateConnect {
  WellKnownChain: (typeof ScType)['WellKnownChain'];
  createScClient: (typeof ScType)['createScClient'];
}

export type ConnectionType = 'ws' | 'sc';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventApiStatus = ApiStatus | 'error';
