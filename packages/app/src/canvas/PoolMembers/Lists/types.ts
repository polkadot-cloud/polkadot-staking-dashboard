// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FetchedPoolMember } from 'contexts/Pools/PoolMembers/types'
import type { PalletNominationPoolsClaimPermission } from 'dedot/chaintypes'
import type { BondedPool } from 'types'

export interface MembersListProps {
	bondedPool: BondedPool
	pagination: boolean
	itemsPerPage: number
	memberCount: number
	isDepositor: boolean
	isRoot: boolean
	isOwner: boolean
	isBouncer: boolean
}

export interface MemberProps {
	member: Member
	bondedPool: BondedPool
	isDepositor: boolean
	isRoot: boolean
	isOwner: boolean
	isBouncer: boolean
}

export type Member = FetchedPoolMember & {
	claimPermission: PalletNominationPoolsClaimPermission | undefined
}
