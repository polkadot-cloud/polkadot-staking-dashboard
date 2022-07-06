// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnySubscan } from 'types';

export interface BondedProps {
  active: number;
  unlocking: number;
  unlocked: number;
  inactive: boolean;
  free: number;
}

export interface EraPointsProps {
  items: AnySubscan;
  height: number;
}

export interface PayoutBarProps {
  payouts: AnySubscan;
  poolClaims: AnySubscan;
  height: string;
}

export interface PayoutLineProps {
  payouts: AnySubscan;
  poolClaims: AnySubscan;
  height: string;
  background?: string;
}

export interface StatPieProps {
  value: number;
  value2: number;
}
