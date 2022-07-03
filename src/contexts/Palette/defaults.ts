// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PaletteContextInterface } from '.';

export const defaultPaletteContext: PaletteContextInterface = {
  openPalette: () => {},
  closePalette: () => {},
  // eslint-disable-next-line
  setPalettePosition: (ref: any) => {},
  // eslint-disable-next-line
  checkPalettePosition: (ref: any) => {},
  open: 0,
  show: 0,
  position: [0, 0],
};
