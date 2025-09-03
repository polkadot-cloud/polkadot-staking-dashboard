// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faBook,
	faChevronDown,
	faCoins,
	faRightFromBracket,
	faServer,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CloudSVG from 'assets/icons/cloud.svg?react'
import { getCategoryId } from 'config/util'
import { useHelp } from 'contexts/Help'
import { useTheme } from 'contexts/Themes'
import { useUi } from 'contexts/UI'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Page, Separator, Tooltip } from 'ui-core/base'
import { Popover } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import { CategoriesPopover } from './Categories'
import { Main } from './Main'
import { NavSimple } from './NavSimple'
import {
	BarButton,
	BarFooterWrapper,
	BarIconsWrapper,
	BarLogoWrapper,
	CategoryHeader,
	Wrapper,
} from './Wrapper'

export const DefaultMenu = () => {
	const { t } = useTranslation('app')
	const {
		advancedMode,
		activeSection,
		setAdvancedMode,
		setActiveSection,
		sideMenuMinimised,
	} = useUi()
	const navigate = useNavigate()
	const { themeElementRef } = useTheme()
	const { openHelp, status: helpStatus } = useHelp()
	const { status: modalStatus } = useOverlay().modal
	const { status: canvasStatus } = useOverlay().canvas

	const [openCategories, setOpenCategories] = useState<boolean>(false)

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
										className={activeSection === 'stake' ? 'active' : ''}
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
							<Tooltip
								text={t('resources')}
								side="right"
								container={themeElementRef.current || undefined}
								delayDuration={0}
								fadeIn
							>
								<BarButton
									type="button"
									onClick={() => {
										openHelp(null)
									}}
								>
									<FontAwesomeIcon icon={faBook} />
								</BarButton>
							</Tooltip>
							<Separator style={{ opacity: 0.25 }} />
							<Tooltip
								text={t('exitAdvancedMode')}
								side="right"
								container={themeElementRef.current || undefined}
								delayDuration={0}
								fadeIn
							>
								<BarButton
									type="button"
									onClick={() => {
										setAdvancedMode(false)
									}}
								>
									<FontAwesomeIcon icon={faRightFromBracket} />
								</BarButton>
							</Tooltip>
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
							<Popover
								open={openCategories}
								portalContainer={themeElementRef.current || undefined}
								content={<CategoriesPopover setOpen={setOpenCategories} />}
								onTriggerClick={() => {
									setOpenCategories(!openCategories)
								}}
								width="145px"
								align="start"
								arrow={false}
								sideOffset={0}
								transparent
							>
								<CategoryHeader className="menu-categories">
									<span>{t(activeSection || 'stake', { ns: 'app' })}</span>
									<span>
										<FontAwesomeIcon
											icon={openCategories ? faTimes : faChevronDown}
											transform={openCategories ? 'shrink-2' : 'shrink-4'}
										/>
									</span>
								</CategoryHeader>
							</Popover>
							<Main
								activeCategory={getCategoryId(activeSection)}
								hidden={openCategories}
							/>
						</section>
						<section></section>
					</Wrapper>
				)
			}
		></Page.Side.Default>
	)
}
