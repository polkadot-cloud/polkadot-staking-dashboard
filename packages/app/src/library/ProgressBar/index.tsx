// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'
import { ProgressBarWrapper, ProgressFill, ProgressTrack } from './Wrappers'

interface ProgressBarProps {
	progress: number
	status?: 'unbonding' | 'unlocked'
}

export const ProgressBar = ({
	progress,
	status = 'unbonding',
}: ProgressBarProps) => {
	const { t } = useTranslation('modals')
	const clamped = Math.min(100, Math.max(0, progress))
	const rounded = Math.round(clamped)

	// Visual minimum: always show at least 1% fill width when actively unbonding
	// so the bar is visible from the start.
	const visualProgress = status === 'unbonding' ? Math.max(1, clamped) : clamped

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
			</ProgressTrack>
		</ProgressBarWrapper>
	)
}
