// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faChevronDown,
	faCoins,
	faPeopleLine,
	faRightFromBracket,
	faServer,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CloudSVG from 'assets/icons/cloud.svg?react'
import { getCategoryId } from 'config/util'
import { useTheme } from 'contexts/Themes'
import { useUi } from 'contexts/UI'
import { getActivePageForCategory } from 'hooks/useActivePages'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { NavSection } from 'types'
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

export const DefaultMenu = ({
	localCategory,
	setLocalCategory,
}: {
	localCategory: NavSection
	setLocalCategory: Dispatch<SetStateAction<NavSection>>
}) => {
	const { t } = useTranslation('app')
	const { advancedMode, setAdvancedMode, sideMenuMinimised } = useUi()
	const navigate = useNavigate()
	const { themeElementRef } = useTheme()
	const { status: modalStatus } = useOverlay().modal
	const { status: canvasStatus } = useOverlay().canvas

	const [openCategories, setOpenCategories] = useState<boolean>(false)

	const transparent = modalStatus === 'open' || canvasStatus === 'open'

	// Navigate to the last active page for a category
	const navigateToCategory = (category: NavSection) => {
		setLocalCategory(category)
		navigate(getActivePageForCategory(category))
	}

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
											navigateToCategory('stake')
										}}
										className={localCategory === 'stake' ? 'active' : ''}
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
											navigateToCategory('validators')
										}}
										className={localCategory === 'validators' ? 'active' : ''}
									>
										<FontAwesomeIcon icon={faServer} />
									</BarButton>
								</Tooltip>
							</section>
							<section>
								<Tooltip
									text={t('pools')}
									side="right"
									container={themeElementRef.current || undefined}
									delayDuration={0}
									fadeIn
								>
									<BarButton
										type="button"
										onClick={() => {
											navigateToCategory('pools')
										}}
										className={localCategory === 'pools' ? 'active' : ''}
									>
										<FontAwesomeIcon icon={faPeopleLine} transform="grow-3" />
									</BarButton>
								</Tooltip>
							</section>
						</BarIconsWrapper>
						<BarFooterWrapper>
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
								content={
									<CategoriesPopover
										setOpen={setOpenCategories}
										setLocalCategory={setLocalCategory}
									/>
								}
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
									<span>{t(localCategory, { ns: 'app' })}</span>
									<span>
										<FontAwesomeIcon
											icon={openCategories ? faTimes : faChevronDown}
											transform={openCategories ? 'shrink-2' : 'shrink-4'}
										/>
									</span>
								</CategoryHeader>
							</Popover>
							<Main
								activeCategory={getCategoryId(localCategory)}
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
