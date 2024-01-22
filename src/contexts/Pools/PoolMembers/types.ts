// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyMetaBatch, MaybeAddress, Sync } from 'types';

export interface PoolMemberContext {
  fetchPoolMembersMetaBatch: (k: string, v: AnyMetaBatch[], r: boolean) => void;
  queryPoolMember: (who: MaybeAddress) => Promise<PoolMember | null>;
  getMembersOfPoolFromNode: (poolId: number) => PoolMember[] | null;
  addToPoolMembers: (member: PoolMember) => void;
  removePoolMember: (w: MaybeAddress) => void;
  poolMembersNode: PoolMember[];
  meta: AnyMetaBatch;
  poolMembersApi: PoolMember[];
  setPoolMembersApi: (p: PoolMember[]) => void;
  fetchedPoolMembersApi: Sync;
  setFetchedPoolMembersApi: (s: Sync) => void;
}

export interface PoolMember {
  poolId: number;
  who: string;
}
