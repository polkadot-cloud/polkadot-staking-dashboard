// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount } from '@polkadot-cloud/connect'
import { useLedger, useLedgerAccounts } from '@polkadot-cloud/connect-ledger'
import {
	QrScanSignature,
	useVaultAccounts,
} from '@polkadot-cloud/connect-vault'
import { formatAccountSs58, isValidAddress } from '@w3ux/util-dedot'
import { useState } from 'react'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

const Network = 'polkadot'
const Ss58 = 0

const VaultModal = ({ onClose }: { onClose: () => void }) => {
	const { addVaultAccount, getVaultAccounts, vaultAccountExists } =
		useVaultAccounts(Network)
	const { setActiveAccount } = useActiveAccount()
	const accounts = getVaultAccounts()
	const [feedback, setFeedback] = useState('Scan a Polkadot Vault account QR.')

	const importAddress = (raw: string) => {
		const address = formatAccountSs58(raw.trim(), Ss58)
		if (!address || !isValidAddress(address)) {
			setFeedback('Invalid Polkadot address.')
			return
		}
		if (vaultAccountExists(address)) {
			setFeedback('This account is already imported.')
			return
		}
		const account = addVaultAccount(1, address, accounts.length)
		if (account) {
			setActiveAccount({ address: account.address, source: account.source })
			onClose()
		}
	}

	return (
		<>
			<Close />
			<Padding>
				<Title>Polkadot Vault</Title>
				<div className="stablecoinsQr">
					<QrScanSignature
						size={250}
						onScan={({ signature }) =>
							importAddress(signature.split(':')?.[1] || signature)
						}
						onError={() => undefined}
					/>
				</div>
				<p>{feedback}</p>
			</Padding>
		</>
	)
}

const LedgerModal = ({ onClose }: { onClose: () => void }) => {
	const { addLedgerAccount, getLedgerAccounts, ledgerAccountExists } =
		useLedgerAccounts(Network)
	const { fetchLedgerAddress, isExecuting } = useLedger()
	const { setActiveAccount } = useActiveAccount()
	const accounts = getLedgerAccounts()
	const [index, setIndex] = useState(0)
	const [message, setMessage] = useState(
		'Connect Ledger and open the Polkadot app.',
	)

	return (
		<>
			<Close />
			<Padding>
				<Title>Ledger</Title>
				<p>{message}</p>
				<label>
					<span>Account Index</span>
					<input
						type="number"
						min="0"
						value={index}
						onChange={(event) => setIndex(Number(event.target.value))}
					/>
				</label>
				<button
					type="button"
					className="stablecoinsPrimary"
					disabled={isExecuting}
					onClick={async () => {
						setMessage('Waiting for Ledger...')
						const response = await fetchLedgerAddress(index, Ss58)
						if (!response?.address) {
							setMessage('Unable to fetch an address from Ledger.')
							return
						}
						if (ledgerAccountExists(response.address)) {
							setMessage('This account is already imported.')
							return
						}
						const account = addLedgerAccount(
							1,
							response.address,
							accounts.length,
						)
						if (account) {
							setActiveAccount({
								address: account.address,
								source: account.source,
							})
							onClose()
						}
					}}
				>
					{isExecuting ? 'Connecting...' : 'Import Ledger Account'}
				</button>
			</Padding>
		</>
	)
}
export const ImportAccounts = () => {
	const { closeModal, config } = useOverlay().modal
	const source = config?.options?.source

	switch (source) {
		case 'ledger':
			return <LedgerModal onClose={closeModal} />
		case 'polkadot_vault':
			return <VaultModal onClose={closeModal} />
		default:
			return null
	}
}
