// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RefObject } from 'react';

export interface TooltipContextInterface {
  openTooltip: () => void;
  closeTooltip: () => void;
  setTooltipPosition: (ref: RefObject<HTMLDivElement>) => void;
  checkTooltipPosition: (ref: RefObject<HTMLDivElement>) => void;
  setTooltipMeta: (t: string) => void;
  open: number;
  show: number;
  position: [number, number];
  text: string;
}
