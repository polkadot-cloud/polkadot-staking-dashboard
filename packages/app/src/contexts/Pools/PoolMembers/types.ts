// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Sync } from '@w3ux/types'
import type { PalletNominationPoolsPoolMember } from 'dedot/chaintypes'

export interface PoolMemberContext {
  fetchPoolMemberData: (addresses: string[]) => void
  meta: FetchedPoolMembers
  fetchedPoolMembersApi: Sync
  setFetchedPoolMembersApi: (s: Sync) => void
}

export interface FetchedPoolMembers {
  poolMembers: (FetchedPoolMember | undefined)[]
  addresses: string[]
}

export type FetchedPoolMember = PalletNominationPoolsPoolMember & {
  address: string
}
