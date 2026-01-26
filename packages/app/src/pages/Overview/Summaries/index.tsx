// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faCircleExclamation,
	type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useNetwork } from 'contexts/Network'
import { useHalving } from 'hooks/useHalving'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary } from 'ui-buttons'
import { Halving } from './Sections/Halving'
import { PoolWarnings } from './Sections/PoolWarnings'
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

	// Sections to render
	const sections: [{ label: string; faIcon?: IconDefinition }, React.FC][] = []

	// TODO: Only add if warnings / join another pool flows exist (from Staking API)
	sections.push([{ label: 'Pool Warnings', faIcon: undefined }, PoolWarnings])

	sections.push([{ label: t('status', { ns: 'app' }) }, Status])

	if (showHalving) {
		sections.push([
			{
				label: t('nextHalving', { ns: 'app' }),
				faIcon: daysUntilHalving <= 90 ? faCircleExclamation : undefined,
			},
			Halving,
		])
	}

	return (
		<CardWrapper style={{ padding: 0 }} height={height}>
			<SectionNav>
				{sections.map(([{ label, faIcon }], index) => (
					<ButtonSecondary
						size="md"
						key={label}
						text={label}
						onClick={() => setActiveSection(index)}
						style={{
							color:
								activeSection === index
									? 'var(--accent-primary)'
									: 'var(--text-secondary)',
						}}
						iconLeft={faIcon}
					/>
				))}
			</SectionNav>
			<SectionsArea
				$activeSection={activeSection}
				$totalSections={sections.length}
			>
				{sections.map(([, Component]) => (
					<div className="section">
						<Component />
					</div>
				))}
			</SectionsArea>
		</CardWrapper>
	)
}
