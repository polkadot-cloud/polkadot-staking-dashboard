// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import type { ReactNode } from 'react'
import type { SubmitProps } from '../types'
import { Ledger } from './Ledger'
import { Vault } from './Vault'

export const ManualSign = (
	props: SubmitProps & {
		children?: ReactNode
		submitted: boolean
		notEnoughFunds: boolean
	},
) => {
	const { getAccount } = useImportedAccounts()
	const { children } = props
	const accountMeta = getAccount(props.submitAccount)
	const source = accountMeta?.source

	// Determine which signing method to use. NOTE: Falls back to `ledger` on all other sources to
	// ensure submit button is displayed.
	switch (source) {
		case 'vault':
			return <Vault {...props}>{children}</Vault>
		default:
			return <Ledger {...props}>{children}</Ledger>
	}
}
