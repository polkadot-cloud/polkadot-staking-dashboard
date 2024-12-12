// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import type { AnyApi, PageProps } from 'common-types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useHelp } from 'contexts/Help'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { useSyncing } from 'hooks/useSyncing'
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers'
import {
  formatSize,
  getPayoutsFromDate,
  getPayoutsToDate,
} from 'library/Graphs/Utils'
import { GraphWrapper } from 'library/Graphs/Wrapper'
import { StatBoxList } from 'library/StatBoxList'
import { StatusLabel } from 'library/StatusLabel'
import { DefaultLocale, locales } from 'locales'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { PageRow, PageTitle } from 'ui-structure'
import { ActiveGraph } from './ActiveGraph'
import { InactiveGraph } from './InactiveGraph'
import { PayoutList } from './PayoutList'
import { LastEraPayoutStat } from './Stats/LastEraPayout'

export const Payouts = ({ page: { key } }: PageProps) => {
  const { i18n, t } = useTranslation()
  const { openHelp } = useHelp()
  const { inSetup } = useStaking()
  const { syncing } = useSyncing()
  const { containerRefs } = useUi()
  const { pluginEnabled } = usePlugins()
  const { getPoolMembership } = useBalances()
  const { activeAccount } = useActiveAccounts()

  const membership = getPoolMembership(activeAccount)
  const nominating = !inSetup()
  const inPool = membership !== null
  const staking = nominating || inPool
  const notStaking = !syncing && !staking

  const [payoutsList, setPayoutLists] = useState<AnyApi[]>([])

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref, {
    outerElement: containerRefs?.mainInterface,
  })
  const { width, height, minHeight } = formatSize(size, 280)

  const payoutsFromDate = getPayoutsFromDate(
    payoutsList,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )
  const payoutsToDate = getPayoutsToDate(
    payoutsList,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )

  useEffect(() => {
    if (!pluginEnabled('staking_api')) {
      setPayoutLists([])
    }
  }, [pluginEnabled('staking_api')])

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <StatBoxList>
        <LastEraPayoutStat />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          <CardHeaderWrapper>
            <h4>
              {t('payouts.payoutHistory', { ns: 'pages' })}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Payout History')}
              />
            </h4>
            <h2>
              {payoutsFromDate && payoutsToDate ? (
                <>
                  {payoutsFromDate}
                  {payoutsToDate !== payoutsFromDate && (
                    <>&nbsp;-&nbsp;{payoutsToDate}</>
                  )}
                </>
              ) : (
                t('payouts.none', { ns: 'pages' })
              )}
            </h2>
          </CardHeaderWrapper>
          <div ref={ref} className="inner" style={{ minHeight }}>
            {!pluginEnabled('staking_api') ? (
              <StatusLabel
                status="active_service"
                statusFor="staking_api"
                title={t('common.stakingApiDisabled', { ns: 'pages' })}
                topOffset="30%"
              />
            ) : (
              <StatusLabel
                status="sync_or_setup"
                title={t('payouts.notStaking', { ns: 'pages' })}
                topOffset="30%"
              />
            )}

            <GraphWrapper
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                opacity: notStaking ? 0.75 : 1,
                transition: 'opacity 0.5s',
              }}
            >
              {staking && pluginEnabled('staking_api') ? (
                <ActiveGraph
                  nominating={nominating}
                  inPool={inPool}
                  setPayoutLists={setPayoutLists}
                />
              ) : (
                <InactiveGraph />
              )}
            </GraphWrapper>
          </div>
        </CardWrapper>
      </PageRow>
      {!!payoutsList?.length && (
        <PageRow>
          <CardWrapper>
            <PayoutList
              title={t('payouts.recentPayouts', { ns: 'pages' })}
              payouts={payoutsList}
              pagination
            />
          </CardWrapper>
        </PageRow>
      )}
    </>
  )
}
