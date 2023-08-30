// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { EraUnclaimedPayouts } from 'contexts/Payouts/types';

export interface ItemProps {
  era: string;
  payouts: EraUnclaimedPayouts;
  setSection: (v: number) => void;
  setPayout: (payout: ActivePayout) => void;
}

export interface ActivePayout {
  era: string;
  payout: string;
  validators: string[];
}
