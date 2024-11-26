// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { MenuContextInterface } from './types';

export const defaultMenuContext: MenuContextInterface = {
  open: false,
  show: false,
  inner: null,
  position: [0, 0],
  openMenu: (ev, newInner) => {},
  closeMenu: () => {},
  setMenuInner: (newInner) => {},
  checkMenuPosition: (menuRef) => {},
};
