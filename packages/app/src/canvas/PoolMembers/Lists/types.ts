// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FetchedPoolMember } from 'contexts/Pools/PoolMembers/types'
import type { PalletNominationPoolsClaimPermission } from 'dedot/chaintypes'

export interface MembersListProps {
	poolId: number
	pagination: boolean
	itemsPerPage: number
	memberCount: number
}

export interface MemberProps {
	member: Member
}

export type Member = FetchedPoolMember & {
	claimPermission: PalletNominationPoolsClaimPermission | undefined
}
