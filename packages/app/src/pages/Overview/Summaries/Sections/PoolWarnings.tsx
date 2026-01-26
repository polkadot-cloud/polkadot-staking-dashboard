// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import {
	FooterWrapper,
	ProgressWrapper,
	SectionWrapper,
	SummaryHeading,
} from '../Wrappers'

export const PoolWarnings = () => {
	const { t } = useTranslation()
	const { openModal } = useOverlay().modal
	return (
		<SectionWrapper>
			<div className="content">
				<SummaryHeading>2 Pool Warnings</SummaryHeading>
				<div style={{ padding: '0 1.5rem' }}>
					<h4>
						Your pool is being destroyed and you cannot earn pool rewards.
						Consider joining another pool.
					</h4>
					<h4>
						Your pool's commission is high. Consider joining a different pool to
						increase rewards.
					</h4>
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
