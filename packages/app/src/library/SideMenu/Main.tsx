// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageCategories } from 'config/pages'
import { getPagesConfig, pageKeyExistsInCategory } from 'config/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import type {
	NavSection,
	PageCategory,
	PageItem,
	PagesConfigItems,
} from 'types'
import { Page } from 'ui-core/base'
import { Primary } from './Primary'

export const Main = ({
	activeCategory,
	showHeaders = false,
	hidden = false,
	setLocalCategory,
}: {
	activeCategory: number | null
	showHeaders?: boolean
	hidden?: boolean
	setLocalCategory?: (category: NavSection) => void
}) => {
	const { t } = useTranslation('app')
	const navigate = useNavigate()
	const { syncing } = useSyncing()
	const { network } = useNetwork()
	const { pathname } = useLocation()
	const { inPool } = useActivePool()
	const { isBonding, isNominating } = useStaking()
	const { formatWithPrefs } = useValidators()
	const { activeAddress } = useActiveAccounts()
	const { sideMenuMinimised, advancedMode } = useUi()
	const { getNominations, getStakingLedger } = useBalances()
	const { controllerUnmigrated } = getStakingLedger(activeAddress)

	const nominated = formatWithPrefs(getNominations(activeAddress))
	const fullCommissionNominees = nominated.filter(
		(nominee) => nominee.prefs.commission === 100,
	)

	// Staking state for pages config filtering
	const stakingState = { inPool, isNominating }

	const pages: PageItem[] = getPagesConfig(
		network,
		activeCategory,
		advancedMode,
		stakingState,
	)

	const pageChanged = activeCategory
		? !pageKeyExistsInCategory(pathname, activeCategory)
		: false

	let i = 0
	for (const { uri } of pages) {
		const handleBullets = (): boolean => {
			if (uri === `${import.meta.env.BASE_URL}`) {
				const warning = !syncing && controllerUnmigrated
				if (warning) {
					pages[i].bullet = 'warning'
					return true
				}
			}
			if (uri === `${import.meta.env.BASE_URL}nominate`) {
				if (isBonding) {
					pages[i].bullet = 'accent'
					return true
				}
				if (
					(!syncing && controllerUnmigrated) ||
					(isBonding && fullCommissionNominees.length > 0)
				) {
					pages[i].bullet = 'warning'
					return true
				}
			}
			if (uri === `${import.meta.env.BASE_URL}pools`) {
				if (inPool) {
					pages[i].bullet = 'accent'
					return true
				}
			}
			if (uri === `${import.meta.env.BASE_URL}stake`) {
				if (inPool || isBonding) {
					pages[i].bullet = 'accent'
					return true
				}
			}
			return false
		}

		handleBullets()
		if (!handleBullets()) {
			pages[i].bullet = undefined
		}
		i++
	}

	const categories = advancedMode
		? PageCategories
		: PageCategories.filter(({ advanced }) => !advanced)

	const pageConfig = {
		categories,
		pages,
	}

	const pagesToDisplay: PagesConfigItems = Object.values(pageConfig.pages)

	return (
		<>
			{pageConfig.categories.map(
				({ id: categoryId, key: categoryKey }: PageCategory) => (
					<div
						className="inner"
						key={`sidemenu_category_${categoryId}`}
						style={{ opacity: hidden ? 0 : 1 }}
					>
						{showHeaders && (
							<Page.Side.Heading
								title={t(categoryKey)}
								minimised={sideMenuMinimised}
							/>
						)}
						{pagesToDisplay.map(
							({ category, hash, key, faIcon, bullet }: PageItem, index) => {
								return (
									<Fragment key={`sidemenu_page_${categoryId}_${key}`}>
										{category === categoryId && (
											<Primary
												pageKey={key}
												name={t(key)}
												to={() => {
													if (!activeCategory && !!setLocalCategory) {
														setLocalCategory(categoryKey)
													}
													navigate(hash)
												}}
												active={
													hash === pathname || (index === 0 && pageChanged)
												}
												faIcon={faIcon}
												bullet={bullet}
												minimised={sideMenuMinimised}
												advanced={advancedMode}
											/>
										)}
									</Fragment>
								)
							},
						)}
					</div>
				),
			)}
		</>
	)
}
