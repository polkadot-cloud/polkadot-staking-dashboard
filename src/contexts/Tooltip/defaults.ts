// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TooltipContextInterface } from './types';

export const defaultTooltipContext: TooltipContextInterface = {
  openTooltip: () => {},
  closeTooltip: () => {},
  // eslint-disable-next-line
  setTooltipPosition: (x, y) => {},
  // eslint-disable-next-line
  showTooltip: () => {},
  // eslint-disable-next-line
  setTooltipTextAndOpen: (t) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  text: '',
};
