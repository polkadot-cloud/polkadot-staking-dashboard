// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MenuContextInterface } from '.';

export const defaultMenuContext: MenuContextInterface = {
  openMenu: () => {},
  closeMenu: () => {},
  // eslint-disable-next-line
  setMenuPosition: (ref: any) => {},
  // eslint-disable-next-line
  checkMenuPosition: (ref: any) => {},
  // eslint-disable-next-line
  setMenuItems: (items: any) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  items: [],
};
