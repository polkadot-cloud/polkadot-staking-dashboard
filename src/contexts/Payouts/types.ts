// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from 'types';

export interface PayoutsContextInterface {
  payoutsSynced: Sync;
  unclaimedPayouts: UnclaimedPayouts;
  removeEraPayout: (era: string, validator: string) => void;
}

// Record<era, EraUnclaimedPayouts>
export type UnclaimedPayouts = Record<string, EraUnclaimedPayouts> | null;

// Record<validator, [page, amount]>
export type EraUnclaimedPayouts = Record<string, [number, string]>;

export interface LocalValidatorExposure {
  staked: string;
  total: string;
  share: string;
  isValidator: boolean;
  exposedPage: number;
}
