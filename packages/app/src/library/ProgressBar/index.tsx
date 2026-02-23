// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'
import {
	ProgressBarWrapper,
	ProgressFill,
	ProgressLabel,
	ProgressTrack,
} from './Wrappers'

interface ProgressBarProps {
	progress: number
	status?: 'unbonding' | 'unlocked'
	showLabel?: boolean
}

export const ProgressBar = ({
	progress,
	status = 'unbonding',
	showLabel = true,
}: ProgressBarProps) => {
	const { t } = useTranslation('modals')
	const clamped = Math.min(100, Math.max(0, progress))
	const rounded = Math.round(clamped)
	const isComplete = status === 'unlocked'

	const label = isComplete ? t('unbondingComplete') : `${rounded}%`

	return (
		<ProgressBarWrapper
			role="progressbar"
			aria-valuenow={rounded}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={t('unbondingProgress', { percent: rounded })}
		>
			<ProgressTrack>
				<ProgressFill $progress={clamped} $status={status} />
			</ProgressTrack>
			{showLabel && <ProgressLabel>{label}</ProgressLabel>}
		</ProgressBarWrapper>
	)
}
