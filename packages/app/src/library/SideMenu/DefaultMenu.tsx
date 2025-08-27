// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DiscordSVG from 'assets/brands/discord.svg?react'
import BookSVG from 'assets/icons/book.svg?react'
import CloudSVG from 'assets/icons/cloud.svg?react'
import EnvelopeSVG from 'assets/icons/envelope.svg?react'
import LogoSVG from 'assets/icons/logo.svg?react'
import { useHelp } from 'contexts/Help'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { Heading } from './Heading/Heading'
import { Main } from './Main'
import { Secondary } from './Secondary'
import { LogoWrapper, ToggleWrapper, Wrapper } from './Wrapper'

export const DefaultMenu = () => {
	const { t } = useTranslation('app')
	const { openHelp } = useHelp()
	const {
		advancedMode,
		sideMenuMinimised,
		userSideMenuMinimised,
		setUserSideMenuMinimised,
	}: UIContextInterface = useUi()
	const { openModal } = useOverlay().modal

	return (
		<Page.Side.Default open={false} minimised={sideMenuMinimised}>
			{advancedMode && (
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
			)}
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
						<Heading title={t('support')} minimised={sideMenuMinimised} />
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
						<Secondary
							onClick={() => openModal({ key: 'DiscordSupport', size: 'sm' })}
							name="Discord"
							minimised={sideMenuMinimised}
							icon={{
								Svg: DiscordSVG,
								size: sideMenuMinimised ? '1.2em' : '1em',
							}}
						/>
						<Secondary
							onClick={() => openModal({ key: 'MailSupport', size: 'sm' })}
							name={t('email', { ns: 'app' })}
							minimised={sideMenuMinimised}
							icon={{
								Svg: EnvelopeSVG,
								size: sideMenuMinimised ? '1.05em' : '0.9em',
							}}
						/>
					</div>
				</section>
				<section></section>
			</Wrapper>
		</Page.Side.Default>
	)
}
