// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  PalletNominationPoolsBondedPoolInner,
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
  }
}
