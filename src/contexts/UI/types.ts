// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface UIContextInterface {
  setSideMenu: (v: number) => void;
  setUserSideMenuMinimised: (v: number) => void;
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: any) => void;
  toggleFilterValidators: (v: string, l: any) => void;
  toggleAllValidatorFilters: (t: number) => void;
  resetValidatorFilters: () => void;
  toggleService: (k: string) => void;
  getSetupProgress: (a: MaybeAccount) => any;
  getSetupProgressPercent: (a: string) => any;
  setActiveAccountSetup: (p: any) => any;
  setActiveAccountSetupSection: (s: number) => void;
  getServices: () => void;
  setOnSetup: (v: any) => void;
  sideMenuOpen: number;
  userSideMenuMinimised: number;
  sideMenuMinimised: number;
  services: any;
  validatorFilters: any;
  validatorOrder: string;
  onSetup: number;
  isSyncing: any;
}
