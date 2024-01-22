// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type PayoutType = 'payouts' | 'unclaimedPayouts' | 'poolClaims';

export type SubscanData = Partial<Record<PayoutType, SubscanResult>>;

export type SubscanPayoutData = Partial<Record<PayoutType, SubscanPayout[]>>;

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

export type SubscanResult =
  | SubscanPayout[]
  | SubscanPoolClaim[]
  | SubscanPoolMember[]
  | SubscanPoolDetails;

export interface SubscanPoolClaim {
  account_display: {
    address: string;
    display: string;
    judgements: number[];
    identity: boolean;
  };
  amount: string;
  block_timestamp: number;
  event_id: string;
  event_index: string;
  extrinsic_index: string;
  module_id: string;
  pool_id: number;
}

export interface SubscanPayout {
  era: number;
  stash: string;
  account: string;
  validator_stash: string;
  amount: string;
  block_timestamp: number;
  event_index: string;
  module_id: string;
  event_id: string;
  extrinsic_index: string;
  invalid_era: boolean;
}

export interface SubscanPoolMember {
  pool_id: number;
  bonded: string;
  account_display: {
    address: string;
    display: string;
    judgements: [
      {
        index: number;
        judgement: string;
      },
    ];
    identity: boolean;
  };
  claimable: string;
}

export interface SubscanPoolDetails {
  member_count: number;
}
