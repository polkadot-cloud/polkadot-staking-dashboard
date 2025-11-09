// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ellipsisFn } from '@w3ux/utils'
import { type FunctionComponent, forwardRef, type SVGProps } from 'react'
import type { ComponentBase } from 'types'
import classes from './index.module.scss'

const Container = forwardRef<HTMLDivElement, ComponentBase>(
	({ children, style }, ref) => {
		return (
			<div className={classes.container} style={style} ref={ref}>
				{children}
			</div>
		)
	},
)

const Address = ({ address, style }: ComponentBase & { address: string }) => {
	return (
		<div className={classes.address} style={style}>
			{ellipsisFn(address)}
		</div>
	)
}

const SourceIcon = ({
	SvgIcon,
	faIcon,
}: {
	SvgIcon?: FunctionComponent<SVGProps<SVGSVGElement>>
	faIcon?: IconDefinition
}) => {
	if (SvgIcon) {
		return (
			<span className={classes.sourceIcon}>
				<SvgIcon />
			</span>
		)
	}
	if (faIcon) {
		return (
			<span className={classes.sourceIcon}>
				<FontAwesomeIcon icon={faIcon} />
			</span>
		)
	}

	return null
}

export const AccountInput = {
	Container,
	Address,
	SourceIcon,
}
