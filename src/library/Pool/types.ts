// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolRoles, PoolState } from 'contexts/Pools/ActivePool/types';
import type { PoolAddresses } from 'contexts/Pools/BondedPools/types';
import type { Identity, SuperIdentity } from 'contexts/Validators/types';
import type { DisplayFor } from '@w3ux/types';

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
  roleIdentities: {
    identities: Record<string, Identity>;
    supers: Record<string, SuperIdentity>;
  };
}

export interface RewardProps {
  address: string;
  displayFor?: DisplayFor;
}

export interface RewardsGraphProps {
  points: number[];
  syncing: boolean;
}
