// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from '@w3ux/types';
import type { AnyMetaBatch } from 'common-types';
import type { MaybeAddress, PoolMember } from 'types';

export interface PoolMemberContext {
  fetchPoolMembersMetaBatch: (k: string, v: AnyMetaBatch[], r: boolean) => void;
  removePoolMember: (w: MaybeAddress) => void;
  meta: AnyMetaBatch;
  poolMembersApi: PoolMember[];
  setPoolMembersApi: (p: PoolMember[]) => void;
  fetchedPoolMembersApi: Sync;
  setFetchedPoolMembersApi: (s: Sync) => void;
}
