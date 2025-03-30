// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NominatorProgress, PoolProgress } from './types'

export const defaultNominatorProgress: NominatorProgress = {
  payee: {
    destination: null,
    account: null,
  },
  nominations: [],
  bond: '',
}

export const defaultPoolProgress: PoolProgress = {
  metadata: '',
  bond: '',
  nominations: [],
  roles: null,
}
