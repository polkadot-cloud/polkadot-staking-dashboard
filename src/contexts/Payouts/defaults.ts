// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PayoutsContextInterface } from './types';

export const MaxSupportedPayoutEras = 7;

export const defaultPayoutsContext: PayoutsContextInterface = {
  payoutsSynced: 'unsynced',
  unclaimedPayouts: null,
};
