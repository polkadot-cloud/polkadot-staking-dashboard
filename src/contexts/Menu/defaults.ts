// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { MenuContextInterface } from './types';

export const defaultMenuContext: MenuContextInterface = {
  openMenu: () => {},
  closeMenu: () => {},
  setMenuPosition: (r) => {},
  checkMenuPosition: (r) => {},
  setMenuItems: (items) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  items: [],
};
