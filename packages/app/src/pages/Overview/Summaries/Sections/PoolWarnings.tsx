// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { Tips } from 'ui-tips'
import type { TipDisplay } from 'ui-tips/types'
import {
	FooterWrapper,
	ProgressWrapper,
	SectionWrapper,
	SummaryHeading,
} from '../Wrappers'

// TODO: dynamically generate based on Staking API response
const warningMessages = [
	'Your pool is being destroyed and you cannot earn pool rewards. Consider joining another pool.',
	"Your pool's commission is high. Consider joining a different pool to increase rewards.",
]

export const PoolWarnings = () => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const { activeAddress } = useActiveAccounts()
	const { openModal } = useOverlay().modal

	// Convert warnings to tip items
	const warningItems: TipDisplay[] = warningMessages.map((message, index) => ({
		id: `pool-warning-${index}`,
		s: 1,
		subtitle: message,
		description: message,
		page: 'overview',
	}))

	return (
		<SectionWrapper>
			<div className="content top">
				<div className="content hPadding vPadding">
					<SummaryHeading>Pool Warnings</SummaryHeading>
				</div>
				<div className="content">
					<Tips
						items={warningItems}
						syncing={false}
						onPageReset={{ network, activeAddress }}
					/>
				</div>
			</div>
			<FooterWrapper>
				<div>
					<ButtonSubmit
						text={t('joinAnotherPool', { ns: 'pages' })}
						lg
						onClick={() => openModal({ key: 'LeavePool', size: 'sm' })}
					/>
				</div>
				<ProgressWrapper>
					<ProgressWrapper className="border">
						<div>
							<h4>{t('unstake', { ns: 'pages' })}</h4>
						</div>
						<FontAwesomeIcon className="icon" icon={faArrowCircleRight} />
						<div className="inactive">
							<h4>{t('withdraw', { ns: 'pages' })}</h4>
						</div>
						<FontAwesomeIcon className="icon" icon={faArrowCircleRight} />
						<div className="inactive">
							<h4>Rejoin</h4>
						</div>
					</ProgressWrapper>
				</ProgressWrapper>
			</FooterWrapper>
		</SectionWrapper>
	)
}
