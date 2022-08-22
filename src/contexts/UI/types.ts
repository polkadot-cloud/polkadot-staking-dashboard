// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface UIContextInterface {
  setSideMenu: (v: number) => void;
  setUserSideMenuMinimised: (v: number) => void;
  toggleService: (k: string) => void;
  getSetupProgress: (a: MaybeAccount) => any;
  getSetupProgressPercent: (a: MaybeAccount) => number;
  setActiveAccountSetup: (p: any) => void;
  setActiveAccountSetupSection: (s: number) => void;
  getServices: () => string[];
  setOnNominatorSetup: (v: any) => void;
  setOnPoolSetup: (v: any) => void;
  sideMenuOpen: number;
  userSideMenuMinimised: number;
  sideMenuMinimised: number;
  services: string[];
  onNominatorSetup: number;
  onPoolSetup: number;
  isSyncing: boolean;
}
