// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useTxMeta } from 'contexts/TxMeta'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { Extension } from 'library/SubmitTx/Signers/Extension'
import { LedgerPrompt, LedgerSubmit } from 'library/SubmitTx/Signers/Ledger'
import { VaultPrompt, VaultSubmit } from 'library/SubmitTx/Signers/Vault'
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
		submitAccount,
		valid = false,
		noMargin = false,
		displayFor = 'default',
		requiresMigratedController = false,
		onResize,
		transparent,
		stacked,
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
				? `${t('submitting', { ns: 'modals' })}...`
				: t('submit', { ns: 'modals' })
		}`

	// Set resize on submit footer UI height changes
	useEffect(() => {
		setModalResize()
		if (onResize) {
			onResize()
		}
	}, [notEnoughFunds, requiresMigratedController])

	// Determine submission component
	let SubmitComponent: React.ReactNode

	// Determine optional prompt component
	let PromptComponent: React.ReactNode | undefined

	if (requiresManualSign(submitAccount)) {
		const accountMeta = getAccount(submitAccount)
		if (accountMeta?.source === 'vault') {
			SubmitComponent = (
				<VaultSubmit
					uid={uid}
					displayFor={displayFor}
					valid={valid}
					submitted={submitted}
					submitText={activeSubmitText}
					onSubmit={onSubmit}
					notEnoughFunds={notEnoughFunds}
					promptStatus={promptStatus}
				/>
			)
			PromptComponent = <VaultPrompt valid={valid} />
		} else {
			// Ledger
			SubmitComponent = (
				<LedgerSubmit
					uid={uid}
					displayFor={displayFor}
					valid={valid}
					submitted={submitted}
					submitText={activeSubmitText}
					submitAccount={submitAccount}
					onSubmit={onSubmit}
					notEnoughFunds={notEnoughFunds}
				/>
			)
			PromptComponent = (
				<LedgerPrompt
					uid={uid}
					displayFor={displayFor}
					valid={valid}
					submitted={submitted}
					submitText={activeSubmitText}
					submitAccount={submitAccount}
					onSubmit={onSubmit}
					notEnoughFunds={notEnoughFunds}
				/>
			)
		}
	} else {
		// Extension
		SubmitComponent = (
			<Extension
				uid={uid}
				displayFor={displayFor}
				submitText={activeSubmitText}
				onSubmit={onSubmit}
				valid={valid}
			/>
		)
		PromptComponent = undefined
	}

	return (
		<Tx
			{...props}
			notEnoughFunds={notEnoughFunds}
			dangerMessage={`${t('notEnough', { ns: 'app' })} ${unit}`}
			margin={!noMargin}
			SubmitComponent={SubmitComponent}
			PromptComponent={PromptComponent}
			displayFor={displayFor}
			transparent={transparent}
			stacked={stacked}
		/>
	)
}
