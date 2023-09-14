// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from 'types';

export type PayoutsContextInterface = {
  payoutsSynced: Sync;
  unclaimedPayouts: UnclaimedPayouts;
  removeEraPayout: (era: string, validator: string) => void;
};

export type UnclaimedPayouts = Record<string, EraUnclaimedPayouts> | null;

export type EraUnclaimedPayouts = Record<string, string>;

export interface LocalValidatorExposure {
  staked: string;
  total: string;
  share: string;
  isValidator: boolean;
}
