// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ServiceInterface } from 'types'

export const defaultServiceInterface: ServiceInterface = {
  query: {
    eraRewardPoints: async () => ({
      total: 0,
      individual: [],
    }),
  },
}
