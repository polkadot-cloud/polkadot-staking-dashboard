// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useNetwork } from 'contexts/Network'
import { useHalving } from 'hooks/useHalving'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary } from 'ui-buttons'
import { Halving } from './Sections/Halving'
import { Status } from './Sections/Status'
import { SectionNav, SectionsArea } from './Wrappers'

export const Summaries = ({ height }: { height: number }) => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const { daysUntilHalving } = useHalving()

	// State to track active section
	const [activeSection, setActiveSection] = useState<number>(0)

	// Halving section is only for Polkadot network
	const showHalving: boolean = network === 'polkadot'

	return (
		<CardWrapper style={{ padding: 0 }} height={height}>
			<SectionNav>
				<ButtonSecondary
					size="md"
					text={t('status', { ns: 'app' })}
					onClick={() => setActiveSection(0)}
					style={{
						color:
							activeSection === 0
								? 'var(--accent-primary)'
								: 'var(--text-secondary)',
					}}
				/>
				{/* NOTE: Only showing halving summary for Polkadot network */}
				{showHalving && (
					<ButtonSecondary
						size="md"
						text={t('nextHalving', { ns: 'app' })}
						onClick={() => setActiveSection(1)}
						style={{
							color:
								activeSection === 1
									? 'var(--accent-primary)'
									: 'var(--text-secondary)',
						}}
						iconLeft={daysUntilHalving <= 90 ? faCircleExclamation : undefined}
					/>
				)}
			</SectionNav>
			<SectionsArea $activeSection={activeSection}>
				<div className="section">
					<Status />
				</div>
				{showHalving && (
					<div className="section">
						<Halving />
					</div>
				)}
			</SectionsArea>
		</CardWrapper>
	)
}
