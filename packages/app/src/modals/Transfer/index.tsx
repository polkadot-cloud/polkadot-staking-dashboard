// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { formatFromProp } from 'hooks/useSubmitExtrinsic/util'
import { AccountDropdown } from 'library/AccountDropdown'
import { BalanceInput } from 'library/Form/BalanceInput'
import { SubmitTx } from 'library/SubmitTx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ImportedAccount } from 'types'
import { Separator } from 'ui-core/base'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const Transfer = () => {
	const { t } = useTranslation()
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

	const {
		balances: { transferableBalance },
	} = useAccountBalances(fromAccount?.address || null)

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
		from: formatFromProp(fromAccount, null), // NOTE: No proxy for transfers - not yet supported
		shouldSubmit: true,
		callbackSubmit: () => {
			closeModal()
		},
	})

	return (
		<>
			<Close />
			<Padding>
				<Title>{t('send', { ns: 'app' })}</Title>

				<Padding>
					<AccountDropdown
						initialAccount={getAccount(activeAccount)}
						accounts={accountsWithSigners}
						onSelect={setFromAccount}
						label={t('from', { ns: 'app' })}
					/>
					<Separator transparent />
					<AccountDropdown
						initialAccount={accounts[0]}
						accounts={accountsWithSigners}
						onSelect={setToAccount}
						label={t('to', { ns: 'app' })}
					/>
					<Separator transparent />
					<BalanceInput
						value={String(0)}
						defaultValue={'0'}
						syncing={false}
						disabled={false}
						setters={[]} /* TODO: Add setter to update amount */
						maxAvailable={
							new BigNumber(planckToUnit(transferableBalance, units))
						}
						disableTxFeeUpdate={false}
					/>
				</Padding>
			</Padding>
			<SubmitTx valid {...submitExtrinsic} />
		</>
	)
}
