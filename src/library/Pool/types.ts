// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolRoles, PoolState } from 'contexts/Pools/ActivePools/types';
import type { PoolAddresses } from 'contexts/Pools/BondedPools/types';
import type { DisplayFor } from 'types';

export interface PoolProps {
  pool: Pool;
}

export interface Pool {
  points: string;
  memberCounter: string;
  addresses: PoolAddresses;
  id: number;
  state: PoolState;
  roles: PoolRoles;
}

export interface RewardProps {
  address: string;
  displayFor?: DisplayFor;
}

export interface RewardsGraphProps {
  points: number[];
  syncing: boolean;
}
