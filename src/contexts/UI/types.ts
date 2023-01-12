// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface UIContextInterface {
  setSideMenu: (v: number) => void;
  setUserSideMenuMinimised: (v: number) => void;
  setContainerRefs: (v: any) => void;
  getSyncById: (id: string) => number | null;
  getSyncStart: (id: string) => number;
  setSyncStart: (id: string, start: number) => void;
  getSyncSynced: (id: string) => boolean;
  setSyncSynced: (id: string) => void;
  sideMenuOpen: number;
  userSideMenuMinimised: number;
  sideMenuMinimised: number;
  containerRefs: any;
  isSyncing: boolean;
  networkSyncing: boolean;
  poolsSyncing: boolean;
}

export interface SyncStart {
  id: string;
  start: number | null;
  synced: boolean;
}
