// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { SubscanContextInterface } from './types';

export const defaultSubscanContext: SubscanContextInterface = {
  fetchEraPoints: (v, e) => {},
  payouts: [],
  poolClaims: [],
  unclaimedPayouts: [],
  payoutsFromDate: undefined,
  payoutsToDate: undefined,
  fetchPoolDetails: (poolId) => new Promise((resolve) => resolve({})),
  fetchPoolMembers: (poolId, page) => new Promise((resolve) => resolve([])),
  setUnclaimedPayouts: (payouts) => {},
};
