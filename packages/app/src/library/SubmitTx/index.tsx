// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useTxMeta } from 'contexts/TxMeta'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { Tx } from 'library/Tx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { Default } from './Default'
import { ManualSign } from './ManualSign'
import type { SubmitTxProps } from './types'

export const SubmitTx = (props: SubmitTxProps) => {
	const {
		uid,
		onSubmit,
		submitText,
		buttons = [],
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
	const { setModalResize } = useOverlay().modal
	const { requiresManualSign } = useImportedAccounts()

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

	return (
		<Tx
			{...props}
			notEnoughFunds={notEnoughFunds}
			dangerMessage={`${t('notEnough', { ns: 'app' })} ${unit}`}
			margin={!noMargin}
			SignerComponent={
				requiresManualSign(submitAccount) ? (
					<ManualSign
						uid={uid}
						onSubmit={onSubmit}
						submitted={submitted}
						valid={valid}
						submitText={activeSubmitText}
						buttons={buttons}
						submitAccount={submitAccount}
						displayFor={displayFor}
						notEnoughFunds={notEnoughFunds}
					/>
				) : (
					<Default
						uid={uid}
						onSubmit={onSubmit}
						submitted={submitted}
						valid={valid}
						submitText={activeSubmitText}
						buttons={buttons}
						submitAccount={submitAccount}
						displayFor={displayFor}
						notEnoughFunds={notEnoughFunds}
					/>
				)
			}
			displayFor={displayFor}
			transparent={transparent}
		/>
	)
}
