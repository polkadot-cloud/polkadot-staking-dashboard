// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount, useImportedAccounts } from '@polkadot-cloud/connect'
import { ButtonModal } from 'ui-buttons'
import { ButtonList, Padding, Title } from 'ui-core/modal'
import { Close } from 'ui-overlay'

export const Accounts = () => {
	const { activeAccount, setActiveAccount } = useActiveAccount()
	const { accounts, accountHasSigner } = useImportedAccounts()

	return (
		<>
			<Close />
			<Padding>
				<Title>Accounts</Title>
				<ButtonList>
					{accounts.length === 0 ? (
						<p>No imported accounts.</p>
					) : (
						accounts.map((account) => {
							const active =
								activeAccount?.address === account.address &&
								activeAccount?.source === account.source

							return (
								<ButtonModal
									key={`${account.source}-${account.address}`}
									selected={active}
									text={account.name || account.address}
									label={
										accountHasSigner({
											address: account.address,
											source: account.source,
										})
											? account.source
											: 'read-only'
									}
									onClick={() => {
										setActiveAccount({
											address: account.address,
											source: account.source,
										})
									}}
								/>
							)
						})
					)}
				</ButtonList>
			</Padding>
		</>
	)
}
