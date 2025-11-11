// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import type { LegendItemProps } from './types'

export const LegendItem = ({
	dataClass,
	label,
	helpKey,
	button,
}: LegendItemProps) => {
	const { openHelpTooltip } = useHelp()

	return (
		<h4>
			{dataClass ? <span className={dataClass} /> : null} {label}
			{helpKey ? (
				<ButtonHelp
					marginLeft
					definition={helpKey}
					openHelp={openHelpTooltip}
				/>
			) : null}
			{button && button}
		</h4>
	)
}
