// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PoolMemberContext } from '../types';

export const defaultPoolMembers: PoolMemberContext = {
  // eslint-disable-next-line
  fetchPoolMembersMetaBatch: (k, v, r) => {},
  // eslint-disable-next-line
  queryPoolMember: (w) => {},
  // eslint-disable-next-line
  getMembersOfPoolFromNode: (p) => {},
  // eslint-disable-next-line
  addToPoolMembers: (m) => {},
  // eslint-disable-next-line
  removePoolMember: (w) => {},
  // eslint-disable-next-line
  getPoolMemberCount: (p) => 0,
  poolMembersApi: [],
  // eslint-disable-next-line
  setPoolMembersApi: (p) => {},
  poolMembersNode: [],
  meta: {},
};
