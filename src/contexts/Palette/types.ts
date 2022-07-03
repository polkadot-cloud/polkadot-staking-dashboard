// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PaletteContextInterface {
  openPalette: () => any;
  closePalette: () => any;
  setPalettePosition: (ref: any) => void;
  checkPalettePosition: (ref: any) => void;
  open: number;
  show: number;
  position: [number, number];
}
