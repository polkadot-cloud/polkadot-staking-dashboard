// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageCategory, PageItem, PagesConfigItems } from 'common-types'
import { PageCategories, PagesConfig } from 'config/pages'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Heading } from './Heading/Heading'
import { Primary } from './Primary'

export const Main = () => {
  const { t } = useTranslation('app')
  const { syncing } = useSyncing()
  const { pathname } = useLocation()
  const { inPool } = useActivePool()
  const { getNominations } = useBalances()
  const { getBondedAccount } = useBonded()
  const { formatWithPrefs } = useValidators()
  const { activeAccount } = useActiveAccounts()
  const { sideMenuMinimised }: UIContextInterface = useUi()
  const { inSetup: inNominatorSetup, addressDifferentToStash } = useStaking()

  const controller = getBondedAccount(activeAccount)
  const controllerDifferentToStash = addressDifferentToStash(controller)

  const nominated = formatWithPrefs(getNominations(activeAccount))
  const fullCommissionNominees = nominated.filter(
    (nominee) => nominee.prefs.commission === 100
  )

  // Inject bullets into menu items
  const pages: PageItem[] = [...PagesConfig]

  let i = 0
  for (const { uri } of pages) {
    const handleBullets = (): boolean => {
      if (uri === `${import.meta.env.BASE_URL}`) {
        const warning = !syncing && controllerDifferentToStash
        if (warning) {
          pages[i].bullet = 'warning'
          return true
        }
      }
      if (uri === `${import.meta.env.BASE_URL}nominate`) {
        if (!inNominatorSetup()) {
          pages[i].bullet = 'accent'
          return true
        }
        if (
          (!syncing && controllerDifferentToStash) ||
          (!inNominatorSetup() && fullCommissionNominees.length > 0)
        ) {
          pages[i].bullet = 'warning'
          return true
        }
      }
      if (uri === `${import.meta.env.BASE_URL}pools`) {
        if (inPool()) {
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
  const pageConfig = {
    categories: PageCategories,
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
