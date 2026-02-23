// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
	const clamped = Math.min(100, Math.max(0, progress))

	return (
		<ProgressBarWrapper>
			<ProgressTrack>
				<ProgressFill $progress={clamped} $status={status} />
			</ProgressTrack>
			{showLabel && <ProgressLabel>{`${Math.round(clamped)}%`}</ProgressLabel>}
		</ProgressBarWrapper>
	)
}
