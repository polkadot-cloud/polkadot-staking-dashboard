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

// The default amount of list items to show per page.
export const listItemsPerPage = 25;
