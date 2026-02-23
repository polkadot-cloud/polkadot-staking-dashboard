// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export interface UseLedgerTxSubmitProps {
	submitted: boolean
	submitText?: string
	onSubmit: () => void
	disabled: boolean
}

export interface UseLedgerTxSubmitReturn {
	text: string
	icon: IconDefinition
	handleOnClick: () => void | Promise<void>
}
