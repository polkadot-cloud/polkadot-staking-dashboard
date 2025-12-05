// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { SubmittableExtrinsic } from 'dedot'
import type { ActiveAccount } from 'types'

export interface UseSubmitExtrinsicProps {
	tx: SubmittableExtrinsic | undefined
	tag?: string
	from: {
		address: MaybeString
		source: MaybeString
	}
	shouldSubmit: boolean
	callbackSubmit?: () => void
	callbackInBlock?: () => void
}

export interface UseSubmitExtrinsic {
	txInitiated: boolean
	uid: number
	onSubmit: () => void
	proxySupported: boolean
	submitAccount: ActiveAccount
}
