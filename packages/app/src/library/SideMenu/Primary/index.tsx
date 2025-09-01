// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUi } from 'contexts/UI'
import { Link } from 'react-router-dom'
import type { PrimaryProps } from '../types'
import { BulletWrapper } from '../Wrapper'
import { Wrapper } from './Wrappers'

export const Primary = ({
	name,
	active,
	to,
	bullet,
	minimised,
	faIcon,
	advanced = false,
}: PrimaryProps) => {
	const { setSideMenu } = useUi()

	const Inner = (
		<Wrapper
			className={`${active ? `active` : `inactive`}${
				minimised ? ` minimised` : ``
			}${bullet ? ` ${bullet}` : ``}${advanced ? ` advanced` : ``}`}
		>
			<span className="iconContainer">
				<FontAwesomeIcon
					icon={faIcon}
					className="icon"
					transform={minimised ? 'grow-2' : undefined}
				/>
			</span>
			{!minimised && (
				<>
					<h4 className="name">{name}</h4>
					{bullet && (
						<BulletWrapper className={bullet}>
							<FontAwesomeIcon icon={faCircle} transform="shrink-6" />
						</BulletWrapper>
					)}
				</>
			)}
		</Wrapper>
	)
	if (typeof to === 'string') {
		return (
			<Link
				to={to}
				onClick={() => {
					if (!active) {
						setSideMenu(false)
					}
				}}
			>
				{Inner}
			</Link>
		)
	}
	if (typeof to === 'function') {
		return (
			<button
				type="button"
				onClick={() => {
					to()
					if (!active) {
						setSideMenu(false)
					}
				}}
			>
				{Inner}
			</button>
		)
	}
	return null
}
