// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import CloudSVG from 'assets/icons/cloud.svg?react'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { AccountDropdown } from 'library/AccountDropdown'
import { Warning } from 'library/Form/Warning'
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge'
import { useAuthChallenge } from 'plugin-staking-api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ImportedAccount } from 'types'
import { Padding, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { ContentWrapper, TitleWrapper } from './Wrappers'

export const SignIn = () => {
	const { t } = useTranslation('modals')
	const { setModalResize } = useOverlay().modal
	const { accounts, accountHasSigner } = useImportedAccounts()
	const { authChallenge, loading, error } = useAuthChallenge()

	// Filter accounts to only show those with signers
	const accountsWithSigners = accounts.filter((account) =>
		accountHasSigner({ address: account.address, source: account.source }),
	)

	const [selectedAccount, setSelectedAccount] =
		useState<ImportedAccount | null>(null)

	const [challengeData, setChallengeData] = useState<{
		challengeId: string
		message: {
			who: string
			url: string
			version: number
			nonce: number
			issuedAt: number
			expireAt: number
		}
	} | null>(null)

	// Call authChallenge when modal opens with the first account
	useEffect(() => {
		if (selectedAccount) {
			authChallenge({
				variables: { address: selectedAccount.address },
			}).then((result: { data?: { authChallenge: typeof challengeData } }) => {
				if (result.data?.authChallenge) {
					setChallengeData(result.data.authChallenge)
				}
			})
		}
	}, [])

	// Refetch challenge when account changes
	useEffect(() => {
		if (selectedAccount) {
			authChallenge({
				variables: { address: selectedAccount.address },
			}).then((result: { data?: { authChallenge: typeof challengeData } }) => {
				if (result.data?.authChallenge) {
					setChallengeData(result.data.authChallenge)
				}
			})
		}
	}, [selectedAccount?.address])

	const handleSignIn = async () => {
		if (!selectedAccount || !challengeData) {
			return
		}

		// TODO: Implement signature generation and authResponse call
		// This would involve:
		// 1. Getting the signer from the selected account
		// 2. Signing the challenge message
		// 3. Calling authResponse with the signature
		// 4. Handling the session result

		console.log('Sign in with account:', selectedAccount.address)
		console.log('Challenge data:', challengeData)
	}

	const canSignIn =
		selectedAccount &&
		challengeData &&
		!loading &&
		accountsWithSigners.length > 0

	return (
		<>
			<Close />
			<Padding>
				{accountsWithSigners.length === 0 && (
					<Warnings>
						<Warning text={t('noActiveAccountWithSigner')} />
					</Warnings>
				)}

				<ContentWrapper>
					<div
						style={{
							width: '100%',
							height: '4rem',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<CloudSVG />
					</div>
					<TitleWrapper>Cloud {t('signIn')}</TitleWrapper>
					{error && (
						<Warnings>
							<Warning text={t('failedToFetchChallenge')} />
						</Warnings>
					)}
					<div className="account-selection">
						<h4>{t('masterAccount')}</h4>
						<AccountDropdown
							initialAccount={accountsWithSigners?.[0] || null}
							accounts={accountsWithSigners}
							onSelect={setSelectedAccount}
							onOpenChange={() => setModalResize()}
						/>

						<p style={{ textAlign: 'center' }}>
							Sign in to Polkadot Cloud with your master account. Your master
							account can be used every time you sign in to sync your dashboard
							state across devices.
						</p>
						<div className="submit-section">
							<ButtonSubmitLarge
								disabled={!canSignIn}
								onSubmit={() => handleSignIn()}
								submitText={t('signIn')}
								pulse={!!canSignIn}
							/>
						</div>
					</div>
				</ContentWrapper>
			</Padding>
		</>
	)
}
