// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface BondedProps {
  active: number;
  unlocking: number;
  unlocked: number;
  inactive: boolean;
  free: number;
}

export interface EraPointsProps {
  items: Array<any>;
  height: number;
}

export interface PayoutBarProps {
  payouts: Array<any>;
  height: string;
}

export interface PayoutLineProps {
  payouts: Array<any>;
  height: string;
  background?: string;
}

export interface StatPieProps {
  value: number;
  value2: number;
}
