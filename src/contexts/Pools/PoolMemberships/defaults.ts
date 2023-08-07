// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolMembership, PoolMembershipsContextState } from '../types';

export const poolMembership: PoolMembership | null = null;

export const defaultPoolMembershipsContext: PoolMembershipsContextState = {
  memberships: [],
  membership: null,
  claimPermissionConfig: [],
};
