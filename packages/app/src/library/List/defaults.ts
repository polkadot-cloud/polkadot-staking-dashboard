// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ListContextInterface } from './types'

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
  pagination: {
    page: 0,
    setPage: (page) => {},
  },
}
