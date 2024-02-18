// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Nominations } from 'contexts/Balances/types';
import type { ActivePool } from 'contexts/Pools/ActivePool/types';

export interface DetailActivePool {
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
