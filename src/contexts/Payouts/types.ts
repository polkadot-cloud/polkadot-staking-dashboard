// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { Sync } from 'types';

export type PayoutsContextInterface = {
  payoutsSynced: Sync;
  pendingPayouts: EraPayout[] | null;
};

export interface EraPayout {
  era: BigNumber;
  payout: BigNumber;
}

export interface LocalValidatorExposure {
  staked: string;
  total: string;
  share: string;
  isValidator: boolean;
}
