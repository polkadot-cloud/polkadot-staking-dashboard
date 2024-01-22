// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { PoolMemberContext } from './types';

export const defaultPoolMembers: PoolMemberContext = {
  fetchPoolMembersMetaBatch: (k, v, r) => {},
  queryPoolMember: (who) => new Promise((resolve) => resolve(null)),
  getMembersOfPoolFromNode: (poolId) => null,
  addToPoolMembers: (m) => {},
  removePoolMember: (w) => {},
  poolMembersApi: [],
  setPoolMembersApi: (p) => {},
  poolMembersNode: [],
  meta: {},
  fetchedPoolMembersApi: 'unsynced',
  setFetchedPoolMembersApi: (s) => {},
};
