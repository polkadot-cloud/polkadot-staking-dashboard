// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TooltipContextInterface } from './types';

export const defaultTooltipContext: TooltipContextInterface = {
  openTooltip: () => {},
  closeTooltip: () => {},
  // eslint-disable-next-line
  setTooltipPosition: (r) => {},
  // eslint-disable-next-line
  checkTooltipPosition: (r) => {},
  // eslint-disable-next-line
  setTooltipMeta: (t) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  text: '',
};
