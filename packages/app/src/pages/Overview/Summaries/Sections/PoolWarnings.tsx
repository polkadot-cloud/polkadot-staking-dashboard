// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useActiveAccountPool } from 'hooks/useActiveAccountPool'
import { Stat } from 'library/Stat'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { Tips } from 'ui-tips'
import type { TipDisplay } from 'ui-tips/types'
import { FooterWrapper, ProgressWrapper, SectionWrapper } from '../Wrappers'

// TODO: dynamically generate based on Staking API response
const warningMessages: {
	subtitle: string
	descrition: string
	format: 'danger' | 'warning'
}[] = [
	{
		subtitle: 'Your pool is being destroyed and you cannot earn pool rewards.',
		descrition:
			'Your pool is being destroyed and you cannot earn pool rewards. Consider joining another pool.',
		format: 'danger',
	},
	{
		subtitle: "Your pool's commission is high.",
		descrition:
			"Your pool's commission is high. Consider joining a different pool to increase rewards.",
		format: 'warning',
	},
]

export const PoolWarnings = () => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const { activeAddress } = useActiveAccounts()
	const { activePool, membershipDisplay } = useActiveAccountPool()
	const { openModal } = useOverlay().modal

	// Track current item format
	const [currentFormat, setCurrentFormat] = useState<
		'warning' | 'danger' | undefined
	>()

	// Determine background color based on format
	const getBackgroundColor = () => {
		if (currentFormat === 'warning') return 'var(--status-warning-bg)'
		if (currentFormat === 'danger') return 'var(--status-danger-bg)'
		return undefined
	}

	// Convert warnings to tip items
	const warningItems: TipDisplay[] = warningMessages.map(
		({ descrition, subtitle, format }, index) => ({
			id: `pool-warning-${index}`,
			s: 1,
			subtitle,
			faTipIcon: faCircle,
			format,
			description: descrition,
			page: 'overview',
		}),
	)

	return (
		<SectionWrapper>
			<div className="content top hPadding vPadding">
				<div
					style={{
						background: getBackgroundColor(),
						paddingTop: '0.5rem',
						paddingBottom: '0.1rem',
						marginTop: '1rem',
						borderRadius: '1.5rem',
						transition: 'background 0.2s ease',
					}}
				>
					<div className="content">
						<Stat
							type="address"
							stat={{
								address: activePool?.addresses?.stash ?? '',
								display: membershipDisplay,
							}}
						/>
					</div>
					<div>
						<Tips
							items={warningItems}
							syncing={false}
							onPageReset={{ network, activeAddress }}
							onUpdate={(item) => setCurrentFormat(item?.format)}
						/>
					</div>
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
