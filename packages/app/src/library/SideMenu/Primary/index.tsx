// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNetwork } from 'contexts/Network'
import { useTheme } from 'contexts/Themes'
import { useUi } from 'contexts/UI'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'ui-core/base'
import { registerSaEvent } from 'utils'
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
	const { t } = useTranslation('app')
	const navigate = useNavigate()
	const { setSideMenu } = useUi()
	const { network } = useNetwork()
	const { themeElementRef } = useTheme()

	const Inner = (
		<button
			type="button"
			onClick={() => {
				registerSaEvent(`${network.toLowerCase()}_${name}_page_visit`)
				if (typeof to === 'function') {
					to()
				} else {
					navigate(to)
				}
				if (!active) {
					setSideMenu(false)
				}
			}}
		>
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
		</button>
	)

	const InnerWithTooltip = (
		<Tooltip
			text={t(name)}
			side="right"
			container={themeElementRef.current || undefined}
			delayDuration={0}
			fadeIn
			inverted
		>
			{Inner}
		</Tooltip>
	)

	return minimised ? InnerWithTooltip : Inner
}
