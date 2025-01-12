// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns'
import { useSyncing } from 'hooks/useSyncing'
import { CardHeaderWrapper } from 'library/Card/Wrappers'
import { formatSize } from 'library/Graphs/Utils'
import { GraphWrapper } from 'library/Graphs/Wrapper'
import { StatusLabel } from 'library/StatusLabel'
import { DefaultLocale, locales } from 'locales'
import type { RewardResult } from 'plugin-staking-api/types'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

  return (
    <>
      <CardHeaderWrapper>
        <h4>{t('overview.recentPayouts')}</h4>
        <h2>
          <Token />
          <Odometer
            value={minDecimalPlaces(
              lastReward === undefined
                ? '0'
                : planckToUnitBn(
                    new BigNumber(lastReward?.reward || 0),
                    units
                  ).toFormat(),
              2
            )}
          />
          <span className="label">
            {lastReward === undefined ? (
              ''
            ) : (
              <>&nbsp;{formatDistance(formatFrom, formatTo, formatOpts)}</>
            )}
          </span>
        </h2>
      </CardHeaderWrapper>
      <div className="inner" ref={graphInnerRef} style={{ minHeight }}>
        {!pluginEnabled('staking_api') ? (
          <StatusLabel
            status="active_service"
            statusFor="staking_api"
            title={t('common.stakingApiDisabled')}
            topOffset="37%"
          />
        ) : (
          <StatusLabel
            status="sync_or_setup"
            title={t('overview.notStaking')}
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
