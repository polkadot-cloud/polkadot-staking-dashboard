// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ListContextInterface } from './types'

export const defaultContext: ListContextInterface = {
  addToSelected: (item) => {},
  removeFromSelected: (items) => {},
  resetSelected: () => {},
  setListFormat: (v: string) => {},
  selectable: false,
  selected: [],
  listFormat: 'col',
  selectToggleable: true,
  pagination: {
    page: 0,
    setPage: (page) => {},
  },
}
