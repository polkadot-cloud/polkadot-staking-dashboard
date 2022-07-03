// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';
import { UIContextInterface } from '.';

export const defaultUIContext: UIContextInterface = {
  // eslint-disable-next-line
  setSideMenu: (v: number) => {},
  // eslint-disable-next-line
  setUserSideMenuMinimised: (v: number) => {},
  // eslint-disable-next-line
  orderValidators: (v: string) => {},
  // eslint-disable-next-line
  applyValidatorOrder: (l: any, o: string) => {},
  // eslint-disable-next-line
  applyValidatorFilters: (l: any, k: string, f?: any) => {},
  // eslint-disable-next-line
  toggleFilterValidators: (v: string, l: any) => {},
  // eslint-disable-next-line
  toggleAllValidatorFilters: (t: number) => {},
  resetValidatorFilters: () => {},
  // eslint-disable-next-line
  toggleService: (k: string) => {},
  // eslint-disable-next-line
  getSetupProgress: (a: MaybeAccount) => {},
  // eslint-disable-next-line
  getSetupProgressPercent: (a: string) => {},
  // eslint-disable-next-line
  setActiveAccountSetup: (p: any) => {},
  // eslint-disable-next-line
  setActiveAccountSetupSection: (s: number) => {},
  getServices: () => {},
  // eslint-disable-next-line
  setOnSetup: (v: any) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  services: [],
  validatorFilters: [],
  validatorOrder: 'default',
  onSetup: 0,
  isSyncing: false,
};
