// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode, RefObject } from 'react';

export interface MenuContextInterface {
  openMenu: () => void;
  closeMenu: () => void;
  setMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
  checkMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
  setMenuInner: (items: ReactNode) => void;
  open: number;
  show: number;
  position: [number, number];
  inner: ReactNode;
}

export interface MenuItem {
  icon: ReactNode;
  title: string;
  cb: () => void;
}
