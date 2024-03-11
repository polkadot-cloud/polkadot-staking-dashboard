// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type * as ScType from '@substrate/connect';
import type { NetworkName } from 'types';

export interface APIConfig {
  type: ConnectionType;
  rpcEndpoint: string;
}

export interface APIEventDetail {
  // TODO: rename this to apiStatus.
  event: EventStatus;
  network: NetworkName;
  err?: string;
}

export interface SubstrateConnect {
  WellKnownChain: (typeof ScType)['WellKnownChain'];
  createScClient: (typeof ScType)['createScClient'];
}

export type ConnectionType = 'ws' | 'sc';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error';
