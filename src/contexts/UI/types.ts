// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
}
