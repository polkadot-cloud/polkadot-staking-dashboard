// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type SyncID =
  | 'initialization'
  | 'balances'
  | 'era-stakers'
  | 'bonded-pools'
  | 'active-pools';

export interface SyncEvent {
  id: SyncID;
  status: SyncStatus;
}

export type SyncStatus = 'syncing' | 'complete';

export type SyncIDConfig = SyncIDWildcard | SyncID[];

export type SyncIDWildcard = '*';
