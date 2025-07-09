// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageCategories } from 'config/pages'
import { getPagesConfig } from 'config/util'
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
import { useLocation } from 'react-router-dom'
import type { PageCategory, PageItem, PagesConfigItems } from 'types'
import { Heading } from './Heading/Heading'
import { Primary } from './Primary'

export const Main = () => {
  const { t } = useTranslation('app')
  const { syncing } = useSyncing()
  const { network } = useNetwork()
  const { pathname } = useLocation()
  const { inPool } = useActivePool()
  const { isBonding } = useStaking()
  const { formatWithPrefs } = useValidators()
  const { activeAddress } = useActiveAccounts()
  const { sideMenuMinimised, advancedMode } = useUi()
  const { getNominations, getStakingLedger } = useBalances()
  const { controllerUnmigrated } = getStakingLedger(activeAddress)

  const nominated = formatWithPrefs(getNominations(activeAddress))
  const fullCommissionNominees = nominated.filter(
    (nominee) => nominee.prefs.commission === 100
  )

  const pages: PageItem[] = getPagesConfig(network, advancedMode)
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
          <div className="inner" key={`sidemenu_category_${categoryId}`}>
            {categoryKey !== 'default' && (
              <Heading title={t(categoryKey)} minimised={sideMenuMinimised} />
            )}
            {pagesToDisplay.map(
              ({ category, hash, key, lottie, bullet }: PageItem) => (
                <Fragment key={`sidemenu_page_${categoryId}_${key}`}>
                  {category === categoryId && (
                    <Primary
                      name={t(key)}
                      to={hash}
                      active={hash === pathname}
                      lottie={lottie}
                      bullet={bullet}
                      minimised={sideMenuMinimised}
                    />
                  )}
                </Fragment>
              )
            )}
          </div>
        )
      )}
    </>
  )
}
