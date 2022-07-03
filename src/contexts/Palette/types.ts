// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RefObject } from 'react';

export interface PaletteContextInterface {
  openPalette: () => void;
  closePalette: () => void;
  setPalettePosition: (ref: RefObject<HTMLDivElement>) => void;
  checkPalettePosition: (ref: RefObject<HTMLDivElement>) => void;
  open: number;
  show: number;
  position: [number, number];
}
