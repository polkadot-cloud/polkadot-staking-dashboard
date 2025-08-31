// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BookSVG from 'assets/icons/book.svg?react'
import CloudSVG from 'assets/icons/cloud.svg?react'
import LogoSVG from 'assets/icons/logo.svg?react'
import { useHelp } from 'contexts/Help'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useTranslation } from 'react-i18next'
import { Separator } from 'ui-core/base'
import { Main } from './Main'
import { Secondary } from './Secondary'
import { LogoWrapper, ToggleWrapper, Wrapper } from './Wrapper'

export const NavSimple = () => {
	const { t } = useTranslation('app')
	const { openHelp } = useHelp()
	const {
		sideMenuMinimised,
		userSideMenuMinimised,
		setUserSideMenuMinimised,
	}: UIContextInterface = useUi()

	return (
		<>
			<ToggleWrapper
				type="button"
				onClick={() => setUserSideMenuMinimised(!userSideMenuMinimised)}
			>
				<span className="label">
					<FontAwesomeIcon
						icon={sideMenuMinimised ? faChevronRight : faChevronLeft}
						transform="shrink-6"
					/>
				</span>
			</ToggleWrapper>
			<Wrapper $minimised={sideMenuMinimised}>
				<section>
					<LogoWrapper
						$minimised={sideMenuMinimised}
						type="button"
						onClick={() => setUserSideMenuMinimised(!userSideMenuMinimised)}
					>
						<CloudSVG />
						{!sideMenuMinimised && (
							<span>
								<LogoSVG className="logo" />
							</span>
						)}
					</LogoWrapper>
					<Main />
					<div className="inner">
						<Separator />
						<Secondary
							onClick={() => {
								openHelp(null)
							}}
							name={t('resources')}
							minimised={sideMenuMinimised}
							icon={{
								Svg: BookSVG,
								size: sideMenuMinimised ? '0.95em' : '0.8em',
							}}
						/>
					</div>
				</section>
				<section></section>
			</Wrapper>
		</>
	)
}
