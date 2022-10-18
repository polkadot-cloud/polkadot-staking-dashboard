// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolMemberContext } from '../types';

export const defaultPoolMembers: PoolMemberContext = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchPoolMembersMetaBatch: (k, v, r) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryPoolMember: (w) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMembersOfPool: (p) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToPoolMembers: (m) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPoolMember: (w) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removePoolMember: (w) => {},
  poolMembers: [],
  meta: {},
};
