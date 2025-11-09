// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { forwardRef } from 'react'
import type { ComponentBaseWithClassName } from 'types'

const Container = forwardRef<HTMLDivElement, ComponentBaseWithClassName>(
	({ children, style, className }, ref) => {
		return (
			<div className={className} style={style} ref={ref}>
				{children}
			</div>
		)
	},
)

export const AccountInput = {
	Container,
}
