// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import type { Nominations } from 'contexts/Balances/types';
import type { ActivePool } from 'contexts/Pools/ActivePool/types';

export interface DetailActivePool {
  address: string;
  pool: ActivePool;
  nominations: Nominations;
}

export interface ActivePoolItem {
  id: string;
  addresses: {
    stash: string;
    reward: string;
  };
}

export type AccountActivePools = Record<string, ActivePool | null>;

export type AccountPoolNominations = Record<string, Nominations>;

export type AccountUnsubs = Record<string, VoidFn>;
