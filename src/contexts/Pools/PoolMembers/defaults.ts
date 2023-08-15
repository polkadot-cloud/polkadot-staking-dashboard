// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolMemberContext } from '../types';

export const defaultPoolMembers: PoolMemberContext = {
  fetchPoolMembersMetaBatch: (k, v, r) => {},
  queryPoolMember: (w) => {},
  getMembersOfPoolFromNode: (p) => {},
  addToPoolMembers: (m) => {},
  removePoolMember: (w) => {},
  getPoolMemberCount: (p) => 0,
  poolMembersApi: [],
  setPoolMembersApi: (p) => {},
  poolMembersNode: [],
  meta: {},
  fetchedPoolMembersApi: 'unsynced',
  setFetchedPoolMembersApi: (s) => {},
};
