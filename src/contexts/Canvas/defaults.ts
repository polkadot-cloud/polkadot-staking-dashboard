// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CanvasContextInterface } from './types';

export const defaultCanvasContext: CanvasContextInterface = {
  // eslint-disable-next-line
  openCanvas: () => {},
  closeCanvas: () => {},
  // eslint-disable-next-line
  setStatus: (s) => {},
  status: 0,
};
