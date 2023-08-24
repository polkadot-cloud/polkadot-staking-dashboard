// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, Sync } from 'types';

export type PayoutsContextInterface = {
  payoutsSynced: Sync;
  payouts: AnyJson;
};
