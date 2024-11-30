// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolMemberContext } from './types';

export const defaultPoolMembers: PoolMemberContext = {
  fetchPoolMembersMetaBatch: (k, v, r) => {},
  removePoolMember: (w) => {},
  poolMembersApi: [],
  setPoolMembersApi: (p) => {},
  meta: {},
  fetchedPoolMembersApi: 'unsynced',
  setFetchedPoolMembersApi: (s) => {},
};
