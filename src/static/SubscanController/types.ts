// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';

export type PayoutType = 'payouts' | 'unclaimedPayouts' | 'poolClaims';

export type SubscanData = Partial<Record<PayoutType, AnyJson>>;

export type SubscanRequestBody =
  | RewardSlashRequestBody
  | RewardRewardsRequestBody
  | RewardMembersRequestBody
  | PoolDetailsRequestBody;

export type RewardSlashRequestBody = SubscanRequestPagination & {
  address: string;
  is_stash: boolean;
};

export type RewardRewardsRequestBody = SubscanRequestPagination & {
  address: string;
};

export type RewardMembersRequestBody = SubscanRequestPagination & {
  pool_id: number;
};

export interface PoolDetailsRequestBody {
  pool_id: number;
}

export interface SubscanRequestPagination {
  row: number;
  page: number;
}
