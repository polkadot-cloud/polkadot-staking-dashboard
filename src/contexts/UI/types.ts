// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface UIContextInterface {
  setSideMenu: (v: number) => void;
  setUserSideMenuMinimised: (v: number) => void;
  toggleService: (k: string) => void;
  getServices: () => string[];
  setContainerRefs: (v: any) => void;
  sideMenuOpen: number;
  userSideMenuMinimised: number;
  sideMenuMinimised: number;
  services: string[];
  containerRefs: any;
  isSyncing: boolean;
  networkSyncing: boolean;
  poolsSyncing: boolean;
}
