// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ServiceInterface } from 'types'

export const defaultServiceInterface: ServiceInterface = {
  query: {
    erasValidatorRewardMulti: async () => [],
    bondedPool: async () => undefined,
    bondedPoolEntries: async () => [],
    erasStakersOverviewEntries: async () => [],
    erasStakersPagedEntries: async () => [],
    identityOfMulti: async () => [],
    paraSessionAccounts: async () => undefined,
    proxies: async () => [],
    sessionValidators: async () => [],
    validatorEntries: async () => [],
  },
  runtimeApi: {
    balanceToPoints: async () => BigInt(0),
    pendingRewards: async () => BigInt(0),
    pointsToBalance: async () => BigInt(0),
  },
}
