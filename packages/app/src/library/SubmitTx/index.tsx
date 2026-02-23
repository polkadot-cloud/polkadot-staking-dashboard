// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useTxMeta } from 'contexts/TxMeta'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useSignerSubmit } from 'hooks/useSignerSubmit'
import { Tx } from 'library/Tx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { SignerContent } from './Signers/SignerContent'
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
	const { setModalResize } = useOverlay().modal

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

	// Single hook call determines signer type and returns unified button state
	const signerState = useSignerSubmit({
		uid,
		onSubmit,
		submitted,
		valid,
		submitText: activeSubmitText,
		submitAccount,
		displayFor,
		notEnoughFunds,
	})

	return (
		<Tx
			{...props}
			notEnoughFunds={notEnoughFunds}
			dangerMessage={`${t('notEnough', { ns: 'app' })} ${unit}`}
			margin={!noMargin}
			SignerComponent={
				<SignerContent
					uid={uid}
					displayFor={displayFor}
					valid={valid}
					signerState={signerState}
				>
					{children}
				</SignerContent>
			}
			displayFor={displayFor}
			transparent={transparent}
		/>
	)
}
