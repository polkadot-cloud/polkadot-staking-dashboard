// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  PalletNominationPoolsBondedPoolInner,
  PalletStakingValidatorPrefs,
  SpStakingExposurePage,
  SpStakingPagedExposureMetadata,
} from 'dedot/chaintypes'
import type { AccountId32 } from 'dedot/codecs'

export interface ServiceInterface {
  query: {
    bondedPool: (
      poolId: number
    ) => Promise<PalletNominationPoolsBondedPoolInner | undefined>
    bondedPoolEntries: () => Promise<
      [number, PalletNominationPoolsBondedPoolInner][]
    >
    erasStakersOverviewEntries: (
      era: number
    ) => Promise<[[number, AccountId32], SpStakingPagedExposureMetadata][]>
    erasStakersPagedEntries: (
      era: number,
      validator: string
    ) => Promise<[[number, AccountId32, number], SpStakingExposurePage][]>
    paraSessionAccounts: (session: number) => Promise<AccountId32[] | undefined>
    proxies: (address: string) => Promise<AccountId32[]>
    sessionValidators: () => Promise<AccountId32[]>
    validatorEntries: () => Promise<
      [AccountId32, PalletStakingValidatorPrefs][]
    >
  }
  runtimeApi: {
    balanceToPoints: (poolId: number, amount: bigint) => Promise<bigint>
    pointsToBalance: (poolId: number, points: bigint) => Promise<bigint>
  }
}
