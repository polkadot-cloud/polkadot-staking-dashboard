// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface UIContextInterface {
  setSideMenu: (v: boolean) => void;
  setUserSideMenuMinimised: (v: boolean) => void;
  setContainerRefs: (v: any) => void;
  sideMenuOpen: boolean;
  userSideMenuMinimised: boolean;
  sideMenuMinimised: boolean;
  containerRefs: any;
  isSyncing: boolean;
  isNetworkSyncing: boolean;
  isPoolSyncing: boolean;
  isBraveBrowser: boolean;
}
