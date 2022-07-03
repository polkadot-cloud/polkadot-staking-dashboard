// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface MenuContextInterface {
  openMenu: () => any;
  closeMenu: () => any;
  setMenuPosition: (ref: any) => void;
  checkMenuPosition: (ref: any) => void;
  setMenuItems: (items: any) => void;
  open: number;
  show: number;
  position: [number, number];
  items: any;
}
