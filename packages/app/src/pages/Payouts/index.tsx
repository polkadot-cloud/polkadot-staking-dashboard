// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import type { AnyApi, PageProps } from 'common-types'
import { MaxPayoutDays } from 'consts'
import { useHelp } from 'contexts/Help'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { Subscan } from 'controllers/Subscan'
import type { PayoutsAndClaims } from 'controllers/Subscan/types'
import { useSubscanData } from 'hooks/useSubscanData'
import { useSyncing } from 'hooks/useSyncing'
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import { formatSize } from 'library/Graphs/Utils'
import { GraphWrapper } from 'library/Graphs/Wrapper'
import { PluginLabel } from 'library/PluginLabel'
import { StatBoxList } from 'library/StatBoxList'
import { StatusLabel } from 'library/StatusLabel'
import { DefaultLocale, locales } from 'locales'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { PageRow, PageTitle } from 'ui-structure'
import { PayoutList } from './PayoutList'
import { LastEraPayoutStat } from './Stats/LastEraPayout'

export const Payouts = ({ page: { key } }: PageProps) => {
  const { i18n, t } = useTranslation()
  const { openHelp } = useHelp()
  const { plugins } = usePlugins()
  const { inSetup } = useStaking()
  const { syncing } = useSyncing()
  const { containerRefs } = useUi()
  let { unclaimedPayouts } = useSubscanData()
  const { payouts, poolClaims, injectBlockTimestamp } = useSubscanData()
  const notStaking = !syncing && inSetup()

  const [payoutsList, setPayoutLists] = useState<AnyApi>([])

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref, {
    outerElement: containerRefs?.mainInterface,
  })
  const { width, height, minHeight } = formatSize(size, 280)

  // Inject `timestamp` for unclaimed payouts.
  unclaimedPayouts = injectBlockTimestamp(unclaimedPayouts)

  const payoutsAndClaims = (payouts as PayoutsAndClaims).concat(poolClaims)
  const payoutsFromDate = Subscan.payoutsFromDate(
    payoutsAndClaims,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )
  const payoutsToDate = Subscan.payoutsToDate(
    payoutsAndClaims,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )

  useEffect(() => {
    // filter zero rewards and order via block timestamp, most recent first.
    setPayoutLists(Subscan.removeNonZeroAmountAndSort(payoutsAndClaims))
  }, [JSON.stringify(payouts), JSON.stringify(poolClaims)])

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <StatBoxList>
        <LastEraPayoutStat />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          <PluginLabel plugin="subscan" />
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
            {!plugins.includes('subscan') ? (
              <StatusLabel
                status="active_service"
                statusFor="subscan"
                title={t('payouts.subscanDisabled', { ns: 'pages' })}
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
              <PayoutBar
                days={MaxPayoutDays}
                height="165px"
                data={{ payouts, unclaimedPayouts, poolClaims }}
              />
              <PayoutLine
                days={MaxPayoutDays}
                average={10}
                height="65px"
                data={{ payouts, unclaimedPayouts, poolClaims }}
              />
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
