// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CanvasContextInterface } from './types';

export const defaultCanvasContext: CanvasContextInterface = {
  // eslint-disable-next-line
  openCanvas: (k) => {},
  closeCanvas: () => {},
  // eslint-disable-next-line
  setStatus: (s) => {},
  status: 0,
};
