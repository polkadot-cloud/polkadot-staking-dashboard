// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useTxMeta } from 'contexts/TxMeta'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { Extension } from 'library/SubmitTx/Signers/Extension'
import { Ledger } from 'library/SubmitTx/Signers/Ledger'
import { Vault } from 'library/SubmitTx/Signers/Vault'
import { Tx } from 'library/Tx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import type { SubmitTxProps } from './types'

export const SubmitTx = (props: SubmitTxProps) => {
	const {
		uid,
		onSubmit,
		submitText,
		children,
		submitAccount,
		valid = false,
		noMargin = false,
		displayFor = 'default',
		requiresMigratedController = false,
		onResize,
		transparent,
	} = props

	const { t } = useTranslation()
	const { network } = useNetwork()
	const { getTxSubmission } = useTxMeta()
	const { status: promptStatus } = usePrompt()
	const { setModalResize } = useOverlay().modal
	const { requiresManualSign, getAccount } = useImportedAccounts()

	const { unit } = getStakingChainData(network)
	const txSubmission = getTxSubmission(uid)
	const from = txSubmission?.from || null
	const fee = txSubmission?.fee || 0n
	const submitted = txSubmission?.submitted || false
	const {
		balances: { balanceTxFees },
	} = useAccountBalances(from)
	const notEnoughFunds = balanceTxFees - fee < 0n && fee > 0n

	// Determine submit button text
	const activeSubmitText =
		submitText ||
		`${
			submitted
				? t('submitting', { ns: 'modals' })
				: t('submit', { ns: 'modals' })
		}`

	// Set resize on submit footer UI height changes
	useEffect(() => {
		setModalResize()
		if (onResize) {
			onResize()
		}
	}, [notEnoughFunds, requiresMigratedController])

	// Determine signer type
	let SignerComponent: React.ReactNode
	if (requiresManualSign(submitAccount)) {
		const accountMeta = getAccount(submitAccount)
		if (accountMeta?.source === 'vault') {
			SignerComponent = (
				<Vault
					uid={uid}
					displayFor={displayFor}
					valid={valid}
					submitted={submitted}
					submitText={activeSubmitText}
					onSubmit={onSubmit}
					notEnoughFunds={notEnoughFunds}
					promptStatus={promptStatus}
				>
					{children}
				</Vault>
			)
		} else {
			// Ledger
			SignerComponent = (
				<Ledger
					uid={uid}
					displayFor={displayFor}
					valid={valid}
					submitted={submitted}
					submitText={activeSubmitText}
					submitAccount={submitAccount}
					onSubmit={onSubmit}
					notEnoughFunds={notEnoughFunds}
				>
					{children}
				</Ledger>
			)
		}
	} else {
		// Extension
		SignerComponent = (
			<Extension
				uid={uid}
				displayFor={displayFor}
				submitText={activeSubmitText}
				onSubmit={onSubmit}
				valid={valid}
			>
				{children}
			</Extension>
		)
	}

	return (
		<Tx
			{...props}
			notEnoughFunds={notEnoughFunds}
			dangerMessage={`${t('notEnough', { ns: 'app' })} ${unit}`}
			margin={!noMargin}
			SignerComponent={SignerComponent}
			displayFor={displayFor}
			transparent={transparent}
		/>
	)
}
