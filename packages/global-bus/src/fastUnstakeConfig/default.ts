// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeConfig } from 'types'

export const defaultFastUnstakeConfig: FastUnstakeConfig = {
  head: {
    stashes: [],
    checked: [],
  },
  counterForQueue: 0,
}
