// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ReactNode,
  RefObject,
  MouseEvent as ReactMouseEvent,
} from 'react';

export interface MenuContextInterface {
  open: boolean;
  show: boolean;
  inner: ReactNode | null;
  position: [number, number];
  openMenu: (ev: MenuMouseEvent, newInner?: ReactNode) => void;
  closeMenu: () => void;
  setMenuInner: (items: ReactNode) => void;
  checkMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
}

export interface MenuItem {
  icon: ReactNode;
  title: string;
  cb: () => void;
}

export type MenuMouseEvent =
  | MouseEvent
  | ReactMouseEvent<HTMLButtonElement, MouseEvent>;
