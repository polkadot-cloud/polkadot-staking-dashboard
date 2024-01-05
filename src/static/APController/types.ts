import type * as ScType from '@substrate/connect';

export interface SubstrateConnect {
  WellKnownChain: (typeof ScType)['WellKnownChain'];
  createScClient: (typeof ScType)['createScClient'];
}

export type ConnectionType = 'ws' | 'sc';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = keyof ApiStatus | 'error';

export interface EventDetail {
  event: EventStatus;
  err?: string;
}
