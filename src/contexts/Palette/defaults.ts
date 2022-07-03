// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PaletteContextInterface } from './types';

export const defaultPaletteContext: PaletteContextInterface = {
  openPalette: () => {},
  closePalette: () => {},
  // eslint-disable-next-line
  setPalettePosition: (ref) => {},
  // eslint-disable-next-line
  checkPalettePosition: (ref) => {},
  open: 0,
  show: 0,
  position: [0, 0],
};
