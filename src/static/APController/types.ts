import type * as ScType from '@substrate/connect';

export interface SubstrateConnect {
  WellKnownChain: (typeof ScType)['WellKnownChain'];
  createScClient: (typeof ScType)['createScClient'];
}

export type ConnectionType = 'ws' | 'sc';
