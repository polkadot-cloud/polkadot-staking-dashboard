// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTooltip } from 'contexts/Tooltip'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'

export const APY = ({ address }: { address: string }) => {
	const { t } = useTranslation()
	const { setTooltipTextAndOpen } = useTooltip()

	// TODO: Get real APY data derived from address
	console.debug(address)

	const tooltipText = `${t('averageRewardRate', {
		ns: 'pages',
	})}`

	return (
		<Label>
			<TooltipArea
				text={tooltipText}
				onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
				style={{ cursor: 'default' }}
			/>
			9.84%{' '}
			<span
				style={{
					fontFamily: 'Inter, sans-serif',
					fontSize: '0.9em',
					marginLeft: '0.15rem',
					marginBottom: '0.15rem',
					opacity: 0.7,
				}}
			>
				APY
			</span>
		</Label>
	)
}
