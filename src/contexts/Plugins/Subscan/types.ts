// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@polkadot-cloud/react/types';
import type { AnySubscan } from 'types';

export interface SubscanContextInterface {
  payouts: AnySubscan;
  poolClaims: AnySubscan;
  unclaimedPayouts: AnySubscan;
  payoutsFromDate: string | undefined;
  payoutsToDate: string | undefined;
  fetchEraPoints: (v: string, e: number) => Promise<AnyJson>;
  fetchPoolDetails: (poolId: number) => Promise<AnyJson>;
  fetchPoolMembers: (poolId: number, page: number) => Promise<AnyJson[]>;
  setUnclaimedPayouts: (payouts: AnySubscan) => void;
}
