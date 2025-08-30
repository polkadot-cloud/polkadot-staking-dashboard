// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOnResize, useOutsideAlerter } from '@w3ux/hooks'
import BookSVG from 'assets/icons/book.svg?react'
import CloudSVG from 'assets/icons/cloud.svg?react'
import LogoSVG from 'assets/icons/logo.svg?react'
import { PageWidthMediumThreshold } from 'consts'
import { useHelp } from 'contexts/Help'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Main } from './Main'
import { Secondary } from './Secondary'
import { LogoWrapper, Wrapper } from './Wrapper'

export const FloatingtMenu = () => {
	const { t } = useTranslation('app')
	const { openHelp } = useHelp()
	const { setSideMenu, sideMenuOpen }: UIContextInterface = useUi()

	// Listen to window resize to automatically hide the side menu on window resize.
	useOnResize(() => {
		if (window.innerWidth >= PageWidthMediumThreshold) {
			setSideMenu(false)
		}
	})

	// Define side menu ref and close the side menu when clicking outside of it.
	const ref = useRef<HTMLDivElement | null>(null)
	useOutsideAlerter(ref, () => {
		setSideMenu(false)
	})

	return (
		<Page.Side.Floating open={sideMenuOpen} minimised={false}>
			<Wrapper ref={ref} $minimised={false}>
				<section>
					<LogoWrapper $minimised={false} type="button">
						<CloudSVG />
						<span>
							<LogoSVG className="logo" />
						</span>
					</LogoWrapper>
					<Main />
					<div className="inner">
						<Page.Side.Heading title={t('support')} minimised={false} />
						<Secondary
							onClick={() => {
								openHelp(null)
							}}
							name={t('resources')}
							minimised={false}
							icon={{
								Svg: BookSVG,
								size: '0.8em',
							}}
						/>
					</div>
				</section>
				<section></section>
			</Wrapper>
		</Page.Side.Floating>
	)
}
