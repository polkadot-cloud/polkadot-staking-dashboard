// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBook, faCoins, faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CloudSVG from 'assets/icons/cloud.svg?react'
import { useHelp } from 'contexts/Help'
import { useUi } from 'contexts/UI'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { Main } from './Main'
import { NavSimple } from './NavSimple'
import {
	BarButton,
	BarFooterWrapper,
	BarIconsWrapper,
	BarLogoWrapper,
	Wrapper,
} from './Wrapper'

export const DefaultMenu = () => {
	const { t } = useTranslation('app')
	const { openHelp, status: helpStatus } = useHelp()
	const { status: modalStatus } = useOverlay().modal
	const { status: canvasStatus } = useOverlay().canvas
	const { advancedMode, sideMenuMinimised } = useUi()

	const transparent =
		modalStatus === 'open' || canvasStatus === 'open' || helpStatus === 'open'

	return (
		<Page.Side.Default
			open={false}
			minimised={sideMenuMinimised}
			transparent={transparent}
			bar={
				!advancedMode ? undefined : (
					<>
						<BarLogoWrapper>
							<CloudSVG />
						</BarLogoWrapper>
						<BarIconsWrapper>
							<section>
								<BarButton type="button" onClick={() => {}} className="active">
									<FontAwesomeIcon icon={faCoins} />
								</BarButton>
							</section>
							<section>
								<BarButton type="button" onClick={() => {}}>
									<FontAwesomeIcon icon={faServer} />
								</BarButton>
							</section>
						</BarIconsWrapper>
						<BarFooterWrapper>
							<BarButton
								type="button"
								onClick={() => {
									openHelp(null)
								}}
							>
								<FontAwesomeIcon icon={faBook} />
							</BarButton>
						</BarFooterWrapper>
					</>
				)
			}
			nav={
				!advancedMode ? (
					<NavSimple />
				) : (
					<Wrapper $minimised={sideMenuMinimised} $advancedMode={advancedMode}>
						<section>
							<h3
								style={{
									color: 'var(--accent-color-primary)',
									margin: '1.12rem 0.75rem 0.75rem 0.25rem',
									paddingBottom: '0.78rem',
									paddingLeft: '0.55rem',
									borderBottom: '1px solid var(--accent-color-primary)',
									fontFamily: 'InterSemiBold, sans-serif',
								}}
							>
								{t('stake', { ns: 'app' })}
							</h3>
							<Main ignoreFirstCategory={true} />
						</section>
						<section></section>
					</Wrapper>
				)
			}
		></Page.Side.Default>
	)
}
