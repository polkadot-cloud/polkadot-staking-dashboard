// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { useSyncing } from 'hooks/useSyncing'
import {
  formatSize,
  getPayoutsFromDate,
  getPayoutsToDate,
} from 'library/Graphs/Utils'
import { GraphWrapper } from 'library/Graphs/Wrapper'
import { StatusLabel } from 'library/StatusLabel'
import { DefaultLocale, locales } from 'locales'
import type { PayoutHistoryProps } from 'pages/Rewards/types'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader } from 'ui-core/base'
import { ActiveGraph } from './ActiveGraph'
import { InactiveGraph } from './InactiveGraph'

export const RecentPayouts = ({
  payoutsList,
  setPayoutsList,
  payoutGraphData,
  loading,
}: PayoutHistoryProps) => {
  const { i18n, t } = useTranslation('pages')
  const { inSetup } = useStaking()
  const { syncing } = useSyncing()
  const { containerRefs } = useUi()
  const { inPool } = useActivePool()
  const { pluginEnabled } = usePlugins()

  const payoutsFromDate = getPayoutsFromDate(
    payoutsList,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )
  const payoutsToDate = getPayoutsToDate(
    payoutsList,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )
  const nominating = !inSetup()
  const staking = nominating || inPool
  const notStaking = !syncing && !staking

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref, {
    outerElement: containerRefs?.mainInterface,
  })
  const { width, height, minHeight } = formatSize(size, 280)

  useEffect(() => {
    if (!pluginEnabled('staking_api')) {
      setPayoutsList([])
    }
  }, [pluginEnabled('staking_api')])

  return (
    <>
      <CardHeader>
        <h4>{t('overview.recentPayouts')}</h4>
        <h2>
          {payoutsFromDate && payoutsToDate ? (
            <>
              {payoutsFromDate}
              {payoutsToDate !== payoutsFromDate && (
                <>&nbsp;-&nbsp;{payoutsToDate}</>
              )}
            </>
          ) : (
            t('payouts.none')
          )}
        </h2>
      </CardHeader>
      <div ref={ref} className="inner" style={{ minHeight }}>
        {!pluginEnabled('staking_api') ? (
          <StatusLabel
            status="active_service"
            statusFor="staking_api"
            title={t('stakingApiDisabled')}
            topOffset="30%"
          />
        ) : (
          notStaking && (
            <StatusLabel
              status="sync_or_setup"
              title={t('payouts.notStaking')}
              topOffset="30%"
            />
          )
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
              inPool={inPool()}
              payoutGraphData={payoutGraphData}
              loading={loading}
            />
          ) : (
            <InactiveGraph />
          )}
        </GraphWrapper>
      </div>
    </>
  )
}
