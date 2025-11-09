// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ellipsisFn } from '@w3ux/utils'
import { type FunctionComponent, forwardRef, type SVGProps } from 'react'
import type { ComponentBase } from 'types'
import type { AccountInputProps } from '../types'
import classes from './index.module.scss'

const Container = forwardRef<
	HTMLButtonElement,
	ComponentBase & {
		onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
	}
>(({ children, style, onClick }, ref) => {
	return (
		<button
			type="button"
			className={classes.container}
			style={style}
			ref={ref}
			onClick={onClick}
		>
			{children}
		</button>
	)
})

const InnerLeft = ({ children, style }: ComponentBase) => {
	return (
		<div className={classes.innerLeft} style={style}>
			{children}
		</div>
	)
}

const InnerRight = ({ children, style }: ComponentBase) => {
	return (
		<div className={classes.innerRight} style={style}>
			{children}
		</div>
	)
}

const Input = forwardRef<HTMLInputElement, AccountInputProps>(
	({ style, placeholder, value, onChange, onFocus, onBlur }, ref) => {
		return (
			<input
				type="text"
				value={value}
				className={classes.input}
				style={style}
				ref={ref}
				placeholder={placeholder}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
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

const Balance = ({
	style,
	label,
	value,
	unit,
}: ComponentBase & { label: string; value: string; unit: string }) => {
	return (
		<h4 className={classes.balance} style={style}>
			{label}: {value} {unit}
		</h4>
	)
}

export const AccountInput = {
	Container,
	InnerLeft,
	InnerRight,
	Input,
	Address,
	SourceIcon,
	Balance,
}
