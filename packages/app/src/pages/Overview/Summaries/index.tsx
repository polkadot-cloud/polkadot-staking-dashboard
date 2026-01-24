// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useHalving } from 'hooks/useHalving'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { ButtonSecondary } from 'ui-buttons'
import { Halving } from './Sections/Halving'
import { Status } from './Sections/Status'
import { SectionNav, SectionsArea } from './Wrappers'

export const Summaries = ({ height }: { height: number }) => {
	const { daysUntilHalving } = useHalving()

	const [activeSection, setActiveSection] = useState<number>(0)

	return (
		<CardWrapper style={{ padding: 0 }} height={height}>
			<SectionNav>
				<ButtonSecondary
					text="Status"
					onClick={() => setActiveSection(0)}
					style={{
						color:
							activeSection === 0
								? 'var(--accent-primary)'
								: 'var(--text-secondary)',
					}}
				/>
				<ButtonSecondary
					text="Next Halving"
					onClick={() => setActiveSection(1)}
					style={{
						color:
							activeSection === 1
								? 'var(--accent-primary)'
								: 'var(--text-secondary)',
					}}
					iconLeft={daysUntilHalving <= 90 ? faCircleExclamation : undefined}
				/>
			</SectionNav>
			<SectionsArea $activeSection={activeSection}>
				<div className="section">
					<Status />
				</div>
				<div className="section">
					<Halving />
				</div>
			</SectionsArea>
		</CardWrapper>
	)
}
