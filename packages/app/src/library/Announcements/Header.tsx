// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { ButtonTertiary } from 'ui-buttons'
import type { HeaderProps } from './types'
import { HeaderWrapper } from './Wrappers'

export const Header = ({ items }: HeaderProps) => {
	const { openHelpTooltip } = useHelp()

	return (
		<HeaderWrapper>
			{items.map(({ label, value, button, helpKey }, i) => (
				<div key={`head_stat_${i}`}>
					<div className="inner">
						<h2>
							{value}
							{button && (
								<ButtonTertiary
									text={button.text}
									onClick={() => button.onClick()}
									disabled={button.disabled}
								/>
							)}
						</h2>
						<h4>
							{label}
							{!!helpKey && (
								<ButtonHelpTooltip
									marginLeft
									definition={helpKey}
									openHelp={openHelpTooltip}
								/>
							)}
						</h4>
					</div>
				</div>
			))}
		</HeaderWrapper>
	)
}
