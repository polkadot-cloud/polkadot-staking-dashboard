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

	// Visual minimum: always show at least 1% fill width when actively unbonding
	// so the bar is visible from the start. Display label still shows the real value.
	const visualProgress = status === 'unbonding' ? Math.max(1, clamped) : clamped

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
				<ProgressFill $progress={visualProgress} $status={status} />
				{showLabel && <ProgressLabel>{label}</ProgressLabel>}
			</ProgressTrack>
		</ProgressBarWrapper>
	)
}
