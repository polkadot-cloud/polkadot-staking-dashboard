// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faCircleUp,
	faHourglass,
	faTrashCan,
} from '@fortawesome/free-regular-svg-icons'
import {
	faArrowCircleRight,
	type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from 'contexts/Themes'
import { useActiveAccountPool } from 'hooks/useActiveAccountPool'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { ButtonRow, Countdown as CountdownWrapper, Tooltip } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import {
	FooterWrapper,
	ProgressWrapper,
	SectionWrapper,
	StatItem,
} from '../Wrappers'

// TODO: dynamically generate based on Staking API response
const warningMessages: {
	value: string
	label?: string
	description: string
	faIcon: IconDefinition
	format: 'danger' | 'warning'
}[] = [
	{
		value: 'Destroying',
		description:
			'Your pool is being destroyed and you cannot earn pool rewards.',
		format: 'danger',
		faIcon: faTrashCan,
	},
	{
		value: 'High Commission',
		faIcon: faCircleUp,
		description:
			"Your pool's commission is high. Consider joining a different pool to increase rewards.",
		format: 'warning',
	},
	{
		value: 'No Change Rate',
		faIcon: faHourglass,
		description:
			'Your pool can increase its commission rate to any value, at any time.',
		format: 'warning',
	},
]

export const PoolWarnings = () => {
	const { t } = useTranslation()
	const { themeElementRef } = useTheme()
	const { activePool, membershipDisplay, label } = useActiveAccountPool()
	const { openModal } = useOverlay().modal

	return (
		<SectionWrapper>
			<div className="content top hPadding vPadding">
				<Stat
					label={label}
					type="address"
					stat={{
						address: activePool?.addresses?.stash ?? '',
						display: membershipDisplay,
					}}
				/>
				<ButtonRow style={{ marginTop: '0.5rem' }}>
					{warningMessages.map(
						({ value, label, format, description, faIcon }) => (
							<StatItem className={`${format}`} key={value}>
								<Tooltip
									text={description}
									side="bottom"
									container={themeElementRef.current || undefined}
									delayDuration={400}
									fadeIn
								>
									<div className={`inner withTooltip ${format}`}>
										<CountdownWrapper variant={format}>
											<FontAwesomeIcon icon={faIcon} />
											{value}
											{label && <span>{label}</span>}
										</CountdownWrapper>
									</div>
								</Tooltip>
							</StatItem>
						),
					)}
				</ButtonRow>
			</div>
			<FooterWrapper>
				<div>
					<ButtonSubmitInvert
						lg
						text={t('joinAnotherPool', { ns: 'pages' })}
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
