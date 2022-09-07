// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolMemberContext } from '../types';

export const defaultPoolMembers: PoolMemberContext = {
  // eslint-disable-next-line
  fetchPoolMembersMetaBatch: (k, v, r) => {},
  // eslint-disable-next-line
  getMembersOfPool: (p) => {},
  // eslint-disable-next-line
  getPoolMember: (w) => null,
  // eslint-disable-next-line
  removePoolMember: (w) => {},
  poolMembers: [],
  meta: {},
};
