// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faChevronLeft,
	faChevronRight,
	faPenToSquare,
	faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTranslation } from 'react-i18next'
import type { SignerProps } from './types'
import { SignerWrapper } from './Wrapper'

export const Signer = (props: SignerProps) => {
	const {
		dangerMessage,
		notEnoughFunds,
		proxyAccount,
		proxySupported,
		requiresMigratedController,
		submitAccount,
		onPreviousSigner,
		onNextSigner,
		hasMultipleSigners,
		valid,
	} = props
	const { t } = useTranslation()
	const { getAccount } = useImportedAccounts()

	// Check if current proxy is actually a proxy (has proxyType) or just the from account
	const isUsingProxy = proxyAccount?.proxyType

	// Determine signing options
	let signingOpts = {
		label: t('signer', { ns: 'app' }),
		who: getAccount(submitAccount),
	}

	if (isUsingProxy && proxySupported) {
		signingOpts = {
			label: t('signedByProxy', { ns: 'app' }),
			who: getAccount(proxyAccount),
		}
	} else if (!isUsingProxy && requiresMigratedController) {
		signingOpts = {
			label: t('signedByController', { ns: 'app' }),
			who: getAccount(submitAccount),
		}
	}

	return (
		<SignerWrapper>
			<span className="badge">
				<FontAwesomeIcon icon={faPenToSquare} className="icon" />
				{signingOpts.label}
			</span>
			{signingOpts.who?.name || ''}
			{hasMultipleSigners && (
				<span className="proxy-switcher">
					<button type="button" onClick={onPreviousSigner} disabled={!valid}>
						<FontAwesomeIcon icon={faChevronLeft} transform="shrink-2" />
					</button>
					<button type="button" onClick={onNextSigner} disabled={!valid}>
						<FontAwesomeIcon icon={faChevronRight} transform="shrink-2" />
					</button>
				</span>
			)}
			{notEnoughFunds && (
				<span className="not-enough">
					/ &nbsp;
					<FontAwesomeIcon
						icon={faWarning}
						className="danger icon"
						transform="shrink-1"
					/>
					<span className="danger">{dangerMessage}</span>
				</span>
			)}
		</SignerWrapper>
	)
}
