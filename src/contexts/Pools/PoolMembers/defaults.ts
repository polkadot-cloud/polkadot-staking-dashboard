// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolMemberContext } from '../types';

export const defaultPoolMembers: PoolMemberContext = {
  // eslint-disable-next-line
  getMembersOfPool: (p) => {},
  poolMembers: [],
};
