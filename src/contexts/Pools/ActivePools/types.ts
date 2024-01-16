// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { NominationStatuses, PoolAddresses } from '../BondedPools/types';
import type { MaybeAddress } from '@polkadot-cloud/react/types';
import type { AnyJson, Sync } from 'types';
import type { Nominations } from 'contexts/Bonded/types';

export interface ActivePoolsContextState {
  isBonding: () => boolean;
  isNominator: () => boolean;
  isOwner: () => boolean;
  isMember: () => boolean;
  isDepositor: () => boolean;
  isBouncer: () => boolean;
  getPoolBondedAccount: () => MaybeAddress;
  getPoolUnlocking: () => PoolUnlocking[];
  getPoolRoles: () => PoolRoles;
  setTargets: (t: PoolTargets) => void;
  getNominationsStatus: () => NominationStatuses;
  setSelectedPoolId: (p: string) => void;
  selectedActivePool: ActivePool | null;
  targets: PoolTargets;
  poolNominations: Nominations;
  synced: Sync;
  selectedPoolMemberCount: number;
}

export interface ActivePool {
  id: number;
  addresses: PoolAddresses;
  bondedPool: ActiveBondedPool;
  rewardPool: RewardPool;
  rewardAccountBalance: BigNumber;
  pendingRewards: BigNumber;
}

export interface ActiveBondedPool {
  points: string;
  memberCounter: string;
  roles: PoolRoles;
  state: PoolState;
}

export interface RewardPool {
  lastRecordedRewardCounter: string;
  lastRecordedTotalPayouts: string;
  totalCommissionClaimed: string;
  totalCommissionPending: string;
  totalRewardsClaimed: string;
}

export type PoolState = 'Open' | 'Blocked' | 'Destroying';

export interface PoolUnlocking {
  era: number;
  value: BigNumber;
}

export type PoolTargets = Record<number, AnyJson>;

export interface PoolRoles {
  depositor?: MaybeAddress;
  nominator?: MaybeAddress;
  root?: MaybeAddress;
  bouncer?: MaybeAddress;
}
