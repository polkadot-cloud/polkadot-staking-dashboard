// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PoolMembership, PoolMembershipsContextState } from '../types';

export const poolMembership: PoolMembership | null = null;

export const defaultPoolMembershipsContext: PoolMembershipsContextState = {
  // eslint-disable-next-line
  getActiveAccountPoolMembership: () => null,
  // eslint-disable-next-line
  getAccountPoolMembership: (a) => null,
  memberships: [],
  claimPermissionConfig: [],
};
