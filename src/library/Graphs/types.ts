// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { AnySubscan } from 'types';

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

export interface StatPieProps {
  value: number;
  value2: number;
}

export interface CardHeaderWrapperProps {
  withAction?: boolean;
  padded?: boolean;
}

export interface CardWrapperProps {
  noPadding?: boolean;
  transparent?: boolean;
  height?: string | number;
  flex?: boolean;
  border?: string;
  warning?: boolean;
}

export interface GraphWrapperProps {
  minHeight?: number;
  transparent?: boolean;
  noMargin?: boolean;
  flex?: boolean;
}

export interface PayoutDayCursor {
  amount: BigNumber;
  event_id: string;
}
