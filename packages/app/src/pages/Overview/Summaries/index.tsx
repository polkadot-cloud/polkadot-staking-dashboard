// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faCircleExclamation,
	faExclamationTriangle,
	type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useNetwork } from 'contexts/Network'
import { useHalving } from 'hooks/useHalving'
import { useSyncing } from 'hooks/useSyncing'
import { useWarnings } from 'hooks/useWarnings'
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
	const { syncing } = useSyncing([
		'initialization',
		'active-pools',
		'era-stakers',
	])
	const { warningMessages } = useWarnings()
	const { daysUntilHalving } = useHalving()

	// State to track active section
	const [activeSection, setActiveSection] = useState<number>(0)

	// Halving section is only for Polkadot network
	const showHalving: boolean = network === 'polkadot'

	// Sections to render
	const sections: [
		{ label: string; faIcon?: IconDefinition; format?: 'warning' | 'danger' },
		React.FC,
	][] = []

	const showWarning = warningMessages.length && !syncing

	// TODO: Only add if warnings / join another pool flows exist (from Staking API)
	// If there are warning messages, show them in the Status section with warning styling
	const statusSectionConfig = showWarning
		? {
				label: t('status', { ns: 'app' }),
				faIcon: faExclamationTriangle,
				format: 'warning' as const,
			}
		: { label: t('status', { ns: 'app' }) }

	sections.push([
		statusSectionConfig,
		() => <Status warningMessages={warningMessages} />,
	])

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
				{sections.map(([{ label, faIcon, format }], index) => (
					<ButtonSecondary
						size="md"
						key={label}
						text={label}
						variant={format}
						onClick={() => setActiveSection(index)}
						active={activeSection === index}
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
