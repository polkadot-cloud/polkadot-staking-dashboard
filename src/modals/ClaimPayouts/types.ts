// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { EraUnclaimedPayouts } from 'contexts/Payouts/types';

export interface ItemProps {
  era: string;
  unclaimedPayout: EraUnclaimedPayouts;
  setSection: (v: number) => void;
  setPayouts: (payout: ActivePayout[] | null) => void;
}

export interface ActivePayout {
  era: string;
  payout: string;
  validators: string[];
}

export interface OverviewProps {
  setSection: (s: number) => void;
  setPayouts: (p: ActivePayout[] | null) => void;
}

export interface FormProps {
  setSection: (s: number) => void;
  payouts: ActivePayout[] | null;
  setPayouts: (p: ActivePayout[] | null) => void;
}
