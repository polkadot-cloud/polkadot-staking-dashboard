// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
`

export const ProgressBarWrapper = styled.div`
	width: 100%;
	margin: 0.75rem 0 0 0;
`

export const ProgressTrack = styled.div`
	position: relative;
	background: var(--btn-bg-secondary);
	border-radius: 0.35rem;
	display: flex;
	overflow: hidden;
	height: 0.7rem;
	width: 100%;
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
			: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-primary) 85%, rgba(255, 255, 255, 0.08) 100%)'};
	transition: width 1.5s cubic-bezier(0, 1, 0, 1);
	position: relative;
	overflow: hidden;

	&::after {
		content: ${({ $status }) => ($status === 'unbonding' ? "''" : 'none')};
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.15) 50%,
			transparent 100%
		);
		animation: ${shimmer} 2.5s ease-in-out infinite;
	}
`

const labelBase = `
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
	pointer-events: none;
`

// Label visible on the unfilled track area.
export const ProgressLabelTrack = styled.span<{
	$progress: number
	$status: 'unbonding' | 'unlocked'
}>`
	${labelBase}
	color: var(--text-primary);
	opacity: ${({ $status, $progress }) => ($status === 'unlocked' ? 1 : Math.min(1, 0.4 + ($progress / 100) * 0.6))};
`

// Identical label clipped to the fill width — white text over the filled area.
export const ProgressLabelFill = styled.span<{
	$progress: number
	$status: 'unbonding' | 'unlocked'
}>`
	${labelBase}
	color: white;
	clip-path: inset(0 ${({ $progress }) => 100 - $progress}% 0 0);
	transition: clip-path 1.5s cubic-bezier(0, 1, 0, 1);
`
