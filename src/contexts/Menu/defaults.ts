// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MenuContextInterface } from './types';

export const defaultMenuContext: MenuContextInterface = {
  openMenu: () => {},
  closeMenu: () => {},
  // eslint-disable-next-line
  setMenuPosition: (r) => {},
  // eslint-disable-next-line
  checkMenuPosition: (r) => {},
  // eslint-disable-next-line
  setMenuItems: (items) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  items: [],
};
