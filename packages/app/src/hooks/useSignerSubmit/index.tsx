// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { usePrompt } from 'contexts/Prompt'
import { useLedgerTxSubmit } from 'hooks/useLedgerTxSubmit'
import { useVaultTxSubmit } from 'hooks/useVaultTxSubmit'
import type {
	SignerSubmitState,
	SignerType,
} from 'library/SubmitTx/SignerSubmitState'
import type { UseSignerSubmitProps } from './types'

export const useSignerSubmit = ({
	uid,
	onSubmit,
	submitted,
	valid,
	submitText,
	submitAccount,
	displayFor,
	notEnoughFunds,
}: UseSignerSubmitProps): SignerSubmitState => {
	const { accountHasSigner, requiresManualSign, getAccount } =
		useImportedAccounts()
	const { status: promptStatus } = usePrompt()

	// Determine signer type
	let signerType: SignerType = 'extension'
	if (requiresManualSign(submitAccount)) {
		const accountMeta = getAccount(submitAccount)
		signerType = accountMeta?.source === 'vault' ? 'vault' : 'ledger'
	}

	// Base disabled state shared by extension and vault
	const baseDisabled =
		submitted || !valid || !accountHasSigner(submitAccount) || notEnoughFunds

	// Always call both hooks unconditionally (rules of hooks). The `enabled`
	// guard prevents Ledger side effects when it is not the active signer.
	const ledgerResult = useLedgerTxSubmit({
		uid,
		submitted,
		valid,
		submitText,
		submitAccount,
		onSubmit,
		notEnoughFunds,
		enabled: signerType === 'ledger',
	})

	const vaultResult = useVaultTxSubmit({
		submitted,
		valid,
		submitText,
		promptStatus,
		disabled: baseDisabled,
	})

	// Select the appropriate result based on signer type
	switch (signerType) {
		case 'ledger':
			return ledgerResult

		case 'vault': {
			// For card displayFor, override disabled/pulse to use base disabled
			const isCard = displayFor === 'card'
			return {
				signerType: 'vault',
				buttonText: vaultResult.buttonText,
				buttonIcon: faSquarePen,
				buttonOnClick: onSubmit,
				buttonDisabled: isCard ? baseDisabled : vaultResult.buttonDisabled,
				buttonPulse: isCard ? !baseDisabled : vaultResult.buttonPulse,
			}
		}

		default:
			// Extension
			return {
				signerType: 'extension',
				buttonText: submitText || '',
				buttonIcon: faArrowAltCircleUp,
				buttonOnClick: onSubmit,
				buttonDisabled: baseDisabled,
				buttonPulse: !baseDisabled,
			}
	}
}
