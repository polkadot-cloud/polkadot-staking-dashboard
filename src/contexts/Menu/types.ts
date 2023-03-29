// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { RefObject } from 'react';

export interface MenuContextInterface {
  openMenu: () => void;
  closeMenu: () => void;
  setMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
  checkMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
  setMenuItems: (items: React.ReactNode[]) => void;
  open: number;
  show: number;
  position: [number, number];
  items: React.ReactNode[];
}
