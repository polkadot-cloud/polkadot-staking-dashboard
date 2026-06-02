// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount, useExternalAccounts } from '@polkadot-cloud/connect'
import { formatAccountSs58, isValidAddress } from '@w3ux/util-dedot'
import { useState } from 'react'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const ExternalAccounts = () => {
	const { config } = useOverlay().modal
	const { closeModal } = useOverlay().modal
	const { addReadOnlyAccount } = useExternalAccounts()
	const { setActiveAccount } = useActiveAccount()
	const [address, setAddress] = useState('')
	const [error, setError] = useState('')

	const type = config?.options?.type || 'read-only'

	if (type !== 'read-only') {
		return null
	}

	return (
		<>
			<Close />
			<Padding>
				<Title>Read Only Account</Title>
				<label>
					<span>Polkadot Address</span>
					<input
						value={address}
						onChange={(event) => setAddress(event.target.value)}
					/>
				</label>
				{error && <p>{error}</p>}
				<button
					type="button"
					className="stablecoinsPrimary"
					onClick={() => {
						const candidate = formatAccountSs58(address.trim(), 0)
						const result = addReadOnlyAccount(candidate || address)
						if (!result || !isValidAddress(result.account.address)) {
							setError('Enter a valid Polkadot address.')
							return
						}
						setActiveAccount({
							address: result.account.address,
							source: result.account.source,
						})
						closeModal()
					}}
				>
					Import Account
				</button>
			</Padding>
		</>
	)
}
