// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBook, faCoins, faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CloudSVG from 'assets/icons/cloud.svg?react'
import { useHelp } from 'contexts/Help'
import { useTheme } from 'contexts/Themes'
import { useUi } from 'contexts/UI'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Page, Tooltip } from 'ui-core/base'
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
	const navigate = useNavigate()
	const { themeElementRef } = useTheme()
	const { openHelp, status: helpStatus } = useHelp()
	const { status: modalStatus } = useOverlay().modal
	const { status: canvasStatus } = useOverlay().canvas
	const { advancedMode, sideMenuMinimised, activeSection, setActiveSection } =
		useUi()

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
								<Tooltip
									text={t('stake')}
									side="right"
									container={themeElementRef.current || undefined}
									delayDuration={100}
									fadeIn
								>
									<BarButton
										type="button"
										onClick={() => {
											setActiveSection('stake')
											navigate(`/overview`)
										}}
										className={
											activeSection === 'stake' || activeSection === null
												? 'active'
												: ''
										}
									>
										<FontAwesomeIcon icon={faCoins} />
									</BarButton>
								</Tooltip>
							</section>
							<section>
								<Tooltip
									text={t('validators')}
									side="right"
									container={themeElementRef.current || undefined}
									delayDuration={0}
									fadeIn
								>
									<BarButton
										type="button"
										onClick={() => {
											setActiveSection('validators')
											navigate(`/validators`)
										}}
										className={activeSection === 'validators' ? 'active' : ''}
									>
										<FontAwesomeIcon icon={faServer} />
									</BarButton>
								</Tooltip>
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
								{t(activeSection || 'stake', { ns: 'app' })}
							</h3>
							<Main />
						</section>
						<section></section>
					</Wrapper>
				)
			}
		></Page.Side.Default>
	)
}
