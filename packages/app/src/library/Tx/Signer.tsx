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
		onPreviousProxy,
		onNextProxy,
		hasMultipleDelegates,
	} = props
	const { t } = useTranslation()
	const { getAccount } = useImportedAccounts()

	// Determine signing options
	let signingOpts = {
		label: t('signer', { ns: 'app' }),
		who: getAccount(submitAccount),
	}

	if (proxyAccount && proxySupported) {
		signingOpts = {
			label: t('signedByProxy', { ns: 'app' }),
			who: getAccount(proxyAccount),
		}
	} else if (!(proxyAccount && proxySupported) && requiresMigratedController) {
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
			{hasMultipleDelegates && proxyAccount && (
				// proxySupported &&
				<span className="proxy-switcher">
					<button type="button" onClick={onPreviousProxy}>
						<FontAwesomeIcon icon={faChevronLeft} transform="shrink-2" />
					</button>
					<button type="button" onClick={onNextProxy}>
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
