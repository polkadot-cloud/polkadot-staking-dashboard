// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface TooltipContextInterface {
  openTooltip: () => void;
  closeTooltip: () => void;
  setTooltipPosition: (x: number, y: number) => void;
  showTooltip: () => void;
  setTooltipTextAndOpen: (t: string) => void;
  open: number;
  show: number;
  position: [number, number];
  text: string;
}
