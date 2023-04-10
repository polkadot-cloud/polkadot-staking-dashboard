// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface UIContextInterface {
  setSideMenu: (v: boolean) => void;
  setUserSideMenuMinimised: (v: boolean) => void;
  setContainerRefs: (v: any) => void;
  getSyncById: (id: string) => number | null;
  getSyncStart: (id: string) => number;
  setSyncStart: (id: string, start: number) => void;
  getSyncSynced: (id: string) => boolean;
  setSyncSynced: (id: string) => void;
  sideMenuOpen: boolean;
  userSideMenuMinimised: boolean;
  sideMenuMinimised: boolean;
  containerRefs: any;
  isSyncing: boolean;
  isNetworkSyncing: boolean;
  isPoolSyncing: boolean;
}

export interface SyncStart {
  id: string;
  start: number | null;
  synced: boolean;
}
