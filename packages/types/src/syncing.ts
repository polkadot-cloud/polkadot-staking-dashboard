// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type SyncId =
	| 'initialization'
	| 'era-stakers'
	| 'bonded-pools'
	| 'active-pools'
	| 'active-proxy'

export type SyncStatus = 'syncing' | 'complete'

export type SyncConfig = '*' | SyncId[]
