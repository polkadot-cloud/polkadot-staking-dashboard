// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useTokenPrices } from 'contexts/TokenPrice'
import { useUi } from 'contexts/UI'
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns'
import { useSyncing } from 'hooks/useSyncing'
import { formatSize } from 'library/Graphs/Utils'
import { GraphWrapper } from 'library/Graphs/Wrapper'
import { StatusLabel } from 'library/StatusLabel'
import { DefaultLocale, locales } from 'locales'
import { formatFiatCurrency } from 'locales/src/util'
import type { RewardResult } from 'plugin-staking-api/types'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, CardLabel } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import { ActiveGraph } from './ActiveGraph'
import { InactiveGraph } from './InactiveGraph'

export const Payouts = () => {
  const { i18n, t } = useTranslation('pages')
  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork()
  const { inSetup } = useStaking()
  const { syncing } = useSyncing()
  const { containerRefs } = useUi()
  const { inPool } = useActivePool()
  const { pluginEnabled } = usePlugins()
  const { price: tokenPrice } = useTokenPrices()

  const staking = !inSetup() || inPool
  const notStaking = !syncing && !staking

  const [lastReward, setLastReward] = useState<RewardResult>()
  // Ref to the graph container
  const graphInnerRef = useRef<HTMLDivElement>(null)

  // Get the size of the graph container
  const size = useSize(graphInnerRef, {
    outerElement: containerRefs?.mainInterface,
  })
  const { width, height, minHeight } = formatSize(size, 260)

  let formatFrom = new Date()
  let formatTo = new Date()
  let formatOpts = {}
  if (lastReward !== undefined) {
    formatFrom = fromUnixTime(lastReward.timestamp ?? getUnixTime(new Date()))
    formatTo = new Date()
    formatOpts = {
      addSuffix: true,
      locale: locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat,
    }
  }

  // Calculate the fiat value of the reward
  const rewardAmount =
    lastReward === undefined
      ? new BigNumber(0)
      : planckToUnitBn(new BigNumber(lastReward?.reward || 0), units)

  // Get formatted amount
  const formattedAmount = minDecimalPlaces(rewardAmount.toFormat(), 2)

  return (
    <>
      <CardHeader>
        <h4>{t('recentPayouts')}</h4>
        <h2>
          <Token />
          <Odometer value={formattedAmount} zeroDecimals={2} />
          <CardLabel>
            {lastReward === undefined ? (
              ''
            ) : (
              <>
                &nbsp;{formatDistance(formatFrom, formatTo, formatOpts)}
                {rewardAmount.isGreaterThan(0) && tokenPrice > 0 && (
                  <span style={{ marginLeft: '0.5rem', opacity: 0.75 }}>
                    {formatFiatCurrency(
                      rewardAmount.multipliedBy(tokenPrice).toNumber()
                    )}
                  </span>
                )}
              </>
            )}
          </CardLabel>
        </h2>
      </CardHeader>
      <div className="inner" ref={graphInnerRef} style={{ minHeight }}>
        {!pluginEnabled('staking_api') ? (
          <StatusLabel
            status="active_service"
            statusFor="staking_api"
            title={t('stakingApiDisabled')}
            topOffset="37%"
          />
        ) : (
          <StatusLabel
            status="sync_or_setup"
            title={t('notStaking')}
            topOffset="37%"
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
              nominating={!inSetup()}
              inPool={inPool()}
              lineMarginTop="3rem"
              setLastReward={setLastReward}
            />
          ) : (
            <InactiveGraph setLastReward={setLastReward} />
          )}
        </GraphWrapper>
      </div>
    </>
  )
}
