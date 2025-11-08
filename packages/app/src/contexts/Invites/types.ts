// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface InvitesContextInterface {
	dismissInvite: () => void
	acknowledged: boolean
	setAcknowledged: (acknowledged: boolean) => void
	inviteConfig: Omit<InviteConfig, 'acknowledged'> | undefined
}

export type InviteType = 'pool' | 'validator'

export interface InviteConfig {
	type: InviteType
	network: string
	invite: PoolInvite
}

export type LocalInviteConfig = InviteConfig & {
	acknowledged: boolean
}

export type PoolInvite = {
	poolId: number
}
