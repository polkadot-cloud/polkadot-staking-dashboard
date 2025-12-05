// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { AccountDropdown } from 'library/AccountDropdown'
import { BondInput } from 'library/Form/Bond/BondInput'
import { SubmitTx } from 'library/SubmitTx'
import { useState } from 'react'
import type { ImportedAccount } from 'types'
import { Separator } from 'ui-core/base'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const Transfer = () => {
	const { serviceApi } = useApi()
	const { network } = useNetwork()
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

	const { units } = getStakingChainData(network)
	const amount = 0.1
	const amountPlanck = unitToPlanck(amount, units)

	const getTx = () => {
		if (!fromAccount || !toAccount) {
			return
		}
		const tx = serviceApi.tx.transferKeepAlive(toAccount.address, amountPlanck)
		return tx
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
				<Title>Transfer</Title>

				<Padding>
					<AccountDropdown
						initialAccount={getAccount(activeAccount)}
						accounts={accountsWithSigners}
						onSelect={setFromAccount}
						label="From"
						disabled
					/>
					<Separator transparent />
					<AccountDropdown
						initialAccount={accounts[0]}
						accounts={accountsWithSigners}
						onSelect={setToAccount}
						label="To"
					/>
					<Separator transparent />
					<BondInput
						value={String(0)}
						defaultValue={'0'}
						syncing={false}
						disabled={false}
						setters={[]}
						freeToBond={new BigNumber(0)}
						disableTxFeeUpdate={false}
					/>
				</Padding>
			</Padding>
			<SubmitTx valid {...submitExtrinsic} />
		</>
	)
}
