// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface SyncEvent {
  id: string;
  status: string;
}

export type SyncStatus = 'syncing' | 'complete';
