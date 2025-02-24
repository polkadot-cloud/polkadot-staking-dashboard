// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { TooltipContextInterface } from './types'

export const defaultTooltipContext: TooltipContextInterface = {
  openTooltip: () => {},
  closeTooltip: () => {},
  setTooltipPosition: (x, y) => {},
  showTooltip: () => {},
  setTooltipTextAndOpen: (t) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  text: '',
}
