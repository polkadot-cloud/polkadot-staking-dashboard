// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { AnyPolkawatch, AnySubscan } from 'types';

export interface BondedProps {
  active: BigNumber;
  free: BigNumber;
  unlocking: BigNumber;
  unlocked: BigNumber;
  inactive: boolean;
}

export interface EraPointsProps {
  items: AnySubscan;
  height: number;
}

export interface PayoutBarProps {
  days: number;
  height: string;
}

export interface PayoutLineProps {
  days: number;
  average: number;
  height: string;
  background?: string;
}

export interface CardHeaderWrapperProps {
  $withAction?: boolean;
  $withMargin?: boolean;
}

export interface CardWrapperProps {
  height?: string | number;
}

export interface PayoutDayCursor {
  amount: BigNumber;
  event_id: string;
}

export interface GeoDonutProps {
  title: string;
  series: AnyPolkawatch;
  width?: string | number;
  height?: string | number;
}
