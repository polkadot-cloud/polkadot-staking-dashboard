// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { ButtonSecondary } from 'ui-buttons'
import { Halving } from './Sections/Halving'
import { Status } from './Sections/Status'
import { SectionNavigation, SectionSlider } from './Wrappers'

export const StakeStatus = ({ height }: { height: number }) => {
	const [activeSection, setActiveSection] = useState<number>(0)

	return (
		<CardWrapper style={{ padding: 0 }} height={height}>
			<SectionNavigation>
				<ButtonSecondary text="Status" onClick={() => setActiveSection(0)} />
				<ButtonSecondary
					text="Next Halving"
					onClick={() => setActiveSection(1)}
				/>
			</SectionNavigation>
			<SectionSlider $activeSection={activeSection}>
				<div className="section">
					<Status />
				</div>
				<div className="section">
					<Halving />
				</div>
			</SectionSlider>
		</CardWrapper>
	)
}
