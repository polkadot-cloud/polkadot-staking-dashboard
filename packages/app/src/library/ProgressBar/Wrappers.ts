// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ProgressBarWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	margin: 0.75rem 0 0 0;
`

export const ProgressTrack = styled.div`
	flex-grow: 1;
	background: var(--btn-bg-secondary);
	border-radius: 0.5rem;
	height: 0.75rem;
	overflow: hidden;
`

export const ProgressFill = styled.div<{
	$progress: number
	$status: 'unbonding' | 'unlocked'
}>`
	height: 100%;
	width: ${({ $progress }) => $progress}%;
	background: ${({ $status }) =>
		$status === 'unlocked'
			? 'var(--status-success)'
			: 'var(--accent-primary)'};
	border-radius: 0.5rem;
	transition: width 1.5s cubic-bezier(0, 1, 0, 1);
`

export const ProgressLabel = styled.span`
	font-family: var(--font-family-semibold);
	font-size: 0.85rem;
	color: var(--text-secondary);
	min-width: 2.75rem;
	text-align: right;
`
