// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnySubscan } from 'types';

export interface SubscanContextInterface {
  fetchEraPoints: (v: string, e: number) => void;
  payouts: AnySubscan;
  poolClaims: AnySubscan;
  unclaimedPayouts: AnySubscan;
  payoutsFromDate: string | undefined;
  payoutsToDate: string | undefined;
  fetchPoolDetails: (poolId: number) => Promise<any>;
  fetchPoolMembers: (poolId: number, page: number) => Promise<any[]>;
  setUnclaimedPayouts: (payouts: AnySubscan) => void;
}
