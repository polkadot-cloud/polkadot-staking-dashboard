import type * as ScType from '@substrate/connect';
import type { NetworkName } from 'types';

export interface SubstrateConnect {
  WellKnownChain: (typeof ScType)['WellKnownChain'];
  createScClient: (typeof ScType)['createScClient'];
}

export type ConnectionType = 'ws' | 'sc';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error';

export interface EventDetail {
  event: EventStatus;
  err?: string;
}

export interface APIConfig {
  type: ConnectionType;
  network: NetworkName;
  rpcEndpoint: string;
}
