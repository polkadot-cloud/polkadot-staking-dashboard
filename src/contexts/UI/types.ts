// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';

export interface UIContextInterface {
  setSideMenu: (v: boolean) => void;
  setUserSideMenuMinimised: (v: boolean) => void;
  setContainerRefs: (v: Record<string, RefObject<HTMLDivElement>>) => void;
  sideMenuOpen: boolean;
  userSideMenuMinimised: boolean;
  sideMenuMinimised: boolean;
  containerRefs: Record<string, RefObject<HTMLDivElement>>;
  isBraveBrowser: boolean;
}
