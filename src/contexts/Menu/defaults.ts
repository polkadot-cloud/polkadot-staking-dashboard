// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject } from 'react';
import { MenuContextInterface } from './types';

export const defaultMenuContext: MenuContextInterface = {
  openMenu: () => {},
  closeMenu: () => {},
  // eslint-disable-next-line
  setMenuPosition: (ref: RefObject<HTMLDivElement>) => {},
  // eslint-disable-next-line
  checkMenuPosition: (ref: RefObject<HTMLDivElement>) => {},
  // eslint-disable-next-line
  setMenuItems: (items: React.ReactNode[]) => {},
  open: 0,
  show: 0,
  position: [0, 0],
  items: [],
};
