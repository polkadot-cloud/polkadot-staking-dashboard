// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faCircleUp,
	faHourglassHalf,
	faTrashCan,
} from '@fortawesome/free-regular-svg-icons'
import {
	faCircleExclamation,
	faExclamationTriangle,
	type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useNetwork } from 'contexts/Network'
import { useHalving } from 'hooks/useHalving'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary } from 'ui-buttons'
import { Halving } from './Sections/Halving'
import { Status } from './Sections/Status'
import type { WarningMessage } from './types'
import { SectionNav, SectionsArea } from './Wrappers'

// TODO: dynamically generate based on Staking API response
const warningMessages: WarningMessage[] = [
	{
		value: 'Pool is Destroying',
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
		faIcon: faHourglassHalf,
		description:
			'Your pool can increase its commission rate to any value, at any time.',
		format: 'warning',
	},
]

export const Summaries = ({ height }: { height: number }) => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const { syncing } = useSyncing()
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

	// TODO: Only add if warnings / join another pool flows exist (from Staking API)
	// If there are warning messages, show them in the Status section with warning styling
	const statusSectionConfig =
		warningMessages.length && !syncing
			? {
					label: `${warningMessages.length} Pool Warning${warningMessages.length > 1 ? 's' : ''}`,
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
						style={{
							color: format
								? undefined
								: activeSection === index
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
