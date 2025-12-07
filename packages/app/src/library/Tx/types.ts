// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SubmitTxProps } from 'library/SubmitTx/types'
import type { ReactElement } from 'react'
import type { DisplayFor } from 'types'

export interface SignerProps extends SubmitTxProps {
	notEnoughFunds: boolean
	dangerMessage: string
}

export interface TxProps extends SignerProps {
	margin?: boolean
	SignerComponent: ReactElement
	displayFor?: DisplayFor
	transparent?: boolean
}
