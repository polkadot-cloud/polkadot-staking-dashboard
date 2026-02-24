// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ProgressBarWrapper = styled.div`
	width: 100%;
	margin: 0.75rem 0 0 0;
`

export const ProgressTrack = styled.div`
	position: relative;
	background: var(--btn-bg-secondary);
	border-radius: 0.65rem;
	display: flex;
	overflow: hidden;
	height: 2.5rem;
	width: 100%;
`

export const ProgressFill = styled.div<{
	$progress: number
	$status: 'unbonding' | 'unlocked'
}>`
	height: 100%;
	width: ${({ $progress }) => $progress}%;
	background: ${({ $status }) => ($status === 'unlocked' ? 'var(--status-success)' : 'var(--accent-primary)')};
	transition: width 1.5s cubic-bezier(0, 1, 0, 1);
`

export const ProgressLabel = styled.span`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--font-family-semibold);
	font-size: 0.95rem;
	color: var(--text-primary);
	pointer-events: none;
`
