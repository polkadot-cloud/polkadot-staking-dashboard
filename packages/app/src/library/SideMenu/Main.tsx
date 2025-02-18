// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { PageCategory, PageItem, PagesConfigItems } from 'common-types'
import { PageCategories, PagesConfig } from 'config/pages'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useSetup } from 'contexts/Setup'
import type { SetupContextInterface } from 'contexts/Setup/types'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Heading } from './Heading/Heading'
import { Primary } from './Primary'

export const Main = () => {
  const { t, i18n } = useTranslation('base')
  const { syncing } = useSyncing()
  const { pathname } = useLocation()
  const { inPool } = useActivePool()
  const { networkData } = useNetwork()
  const {
    getPoolSetupPercent,
    getNominatorSetupPercent,
  }: SetupContextInterface = useSetup()
  const { getNominations } = useBalances()
  const { getBondedAccount } = useBonded()
  const { accounts } = useImportedAccounts()
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

  const [pageConfig, setPageConfig] = useState<AnyJson>({
    categories: Object.assign(PageCategories),
    pages: Object.assign(PagesConfig),
  })

  // Configure side menu bullets for active account
  useEffect(() => {
    if (!accounts.length) {
      return
    }
    // Inject actions into menu items
    const pages: PageItem[] = Object.assign(pageConfig.pages)

    let i = 0
    for (const { uri } of pages) {
      if (uri === `${import.meta.env.BASE_URL}`) {
        const warning = !syncing && controllerDifferentToStash
        if (warning) {
          pages[i].bullet = 'warning'
        }
      }
      if (uri === `${import.meta.env.BASE_URL}nominate`) {
        const staking = !inNominatorSetup()
        if (staking) {
          pages[i].bullet = 'accent'
        }
        if (
          (!syncing && controllerDifferentToStash) ||
          (!inNominatorSetup() && fullCommissionNominees.length > 0)
        ) {
          pages[i].bullet = 'warning'
        }
      }
      if (uri === `${import.meta.env.BASE_URL}pools`) {
        if (inPool()) {
          pages[i].bullet = 'accent'
        }
      }
      i++
    }
    setPageConfig({
      categories: pageConfig.categories,
      pages,
    })
  }, [
    networkData,
    activeAccount,
    accounts,
    controllerDifferentToStash,
    syncing,
    inPool(),
    inNominatorSetup(),
    getNominatorSetupPercent(activeAccount),
    getPoolSetupPercent(activeAccount),
    i18n.resolvedLanguage,
  ])

  // remove pages that network does not support
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
