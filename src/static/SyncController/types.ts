// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface SyncEvent {
  id: SyncID;
  status: SyncStatus;
}

export type SyncID =
  | 'initialization'
  | 'balances'
  | 'era-stakers'
  | 'active-pools';

export type SyncStatus = 'syncing' | 'complete';

export type SyncIDConfig = SyncIDWildcard | SyncID[] | SyncIDWithDefault[];

export type SyncIDWithDefault = [SyncID, SyncStatus];

export type SyncIDWildcard = '*';
