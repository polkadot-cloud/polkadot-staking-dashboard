// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useBatchCall } from 'hooks/useBatchCall'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { AccountDropdown } from 'library/AccountDropdown'
import { SubmitTx } from 'library/SubmitTx'
import { useState } from 'react'
import type { ImportedAccount } from 'types'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const BalanceTest = () => {
	const { serviceApi } = useApi()
	const { network } = useNetwork()
	const { newBatchCall } = useBatchCall()
	const { closeModal } = useOverlay().modal
	const { activeAccount } = useActiveAccounts()
	const { accounts, accountHasSigner, getAccount } = useImportedAccounts()

	// Filter accounts to only show those with signers
	const accountsWithSigners = accounts.filter((account) =>
		accountHasSigner({ address: account.address, source: account.source }),
	)

	// State for selected accounts
	const [fromAccount, setFromAccount] = useState<ImportedAccount | null>(
		getAccount(activeAccount),
	)
	const [toAccount, setToAccount] = useState<ImportedAccount | null>(
		accounts[0],
	)

	const { units, unit } = getStakingChainData(network)
	const amount = 0.1
	const amountPlanck = unitToPlanck(amount, units)

	const getTx = () => {
		if (!fromAccount || !toAccount) {
			return
		}
		const txs = [
			serviceApi.tx.transferKeepAlive(toAccount.address, amountPlanck),
			serviceApi.tx.transferKeepAlive(toAccount.address, amountPlanck),
		].filter((tx) => tx !== undefined)

		const batch = newBatchCall(txs, fromAccount.address)
		return batch
	}

	const submitExtrinsic = useSubmitExtrinsic({
		tx: getTx(),
		from: fromAccount?.address || '',
		shouldSubmit: true,
		callbackSubmit: () => {
			closeModal()
		},
	})

	return (
		<>
			<Close />
			<Padding>
				<Title>Balance Test</Title>

				<h4 style={{ marginTop: '1rem' }}>From:</h4>
				<AccountDropdown
					initialAccount={getAccount(activeAccount)}
					accounts={accountsWithSigners}
					onSelect={setFromAccount}
					disabled
				/>

				<h4 style={{ marginTop: '1rem' }}>To:</h4>
				<AccountDropdown
					initialAccount={accounts[0]}
					accounts={accountsWithSigners}
					onSelect={setToAccount}
				/>

				<h4 style={{ marginTop: '1rem' }}>Amount:</h4>
				<h2>
					{amount} {unit} x 2
				</h2>
			</Padding>
			<SubmitTx valid {...submitExtrinsic} />
		</>
	)
}
