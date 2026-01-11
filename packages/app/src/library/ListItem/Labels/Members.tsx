// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'
import { useOverlay } from 'ui-overlay'

export const Members = ({
	memberCounter,
	poolId,
}: {
	memberCounter: number
	poolId: number
}) => {
	const { t } = useTranslation('app')
	const { openCanvas } = useOverlay().canvas
	const { setTooltipTextAndOpen } = useTooltip()

	const tooltipText = t('poolMembers')

	return (
		<button
			type="button"
			onClick={() => {
				openCanvas({
					key: 'PoolMembers',
					options: {
						poolId,
					},
					size: 'xl',
				})
			}}
		>
			<Label>
				<TooltipArea
					text={tooltipText}
					onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
				/>
				<FontAwesomeIcon icon={faUsers} />
				&nbsp;{memberCounter}
			</Label>
		</button>
	)
}
