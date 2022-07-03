// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MenuContextInterface } from './types';

export const defaultMenuContext: MenuContextInterface = {
  openMenu: () => {},
  closeMenu: () => {},
  // eslint-disable-next-line
  setMenuPosition: (ref) => {},
  // eslint-disable-next-line
  checkMenuPosition: (ref) => {},
  // eslint-disable-next-line
  setMenuItems: (items) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  items: [],
};
