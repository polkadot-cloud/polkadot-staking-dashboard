// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'types'

export interface NominationsEmptyProps {
	bondFor: 'nominator' | 'pool'
	nominator: string | null
	nominated: Validator[]
	disabled?: boolean
	title?: string
}
