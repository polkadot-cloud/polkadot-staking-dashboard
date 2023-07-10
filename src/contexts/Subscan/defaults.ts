// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubscanContextInterface } from './types';

export const defaultSubscanContext: SubscanContextInterface = {
  // eslint-disable-next-line
  fetchEraPoints: (v, e) => {},
  payouts: [],
  poolClaims: [],
  unclaimedPayouts: [],
  payoutsFromDate: undefined,
  payoutsToDate: undefined,
  // eslint-disable-next-line
  fetchPoolMembers: (poolId, page) => new Promise((resolve) => resolve([])),
};
