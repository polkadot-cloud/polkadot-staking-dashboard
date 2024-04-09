// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ListContextInterface } from './types';

export const defaultContext: ListContextInterface = {
  setSelectActive: (selectedActive) => {},
  addToSelected: (item) => {},
  removeFromSelected: (items) => {},
  resetSelected: () => {},
  setListFormat: (v: string) => {},
  selectActive: false,
  selected: [],
  listFormat: 'col',
  selectToggleable: true,
};

// The amount of pools per page.
export const poolsPerPage = 30;

// The amount of validators per page.
export const validatorsPerPage = 30;

// The amount of payouts per page.
export const payoutsPerPage = 50;

// The amount of pool members per page.
export const poolMembersPerPage = 50;
