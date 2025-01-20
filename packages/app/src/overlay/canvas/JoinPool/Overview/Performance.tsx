// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useHelp } from 'contexts/Help'
import { usePlugins } from 'contexts/Plugins'
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance'
import { useUi } from 'contexts/UI'
import { LegacyEraPoints } from 'library/Graphs/LegacyEraPoints'
import { formatSize } from 'library/Graphs/Utils'
import { StatusLabel } from 'library/StatusLabel'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { GraphInner, Subheading } from 'ui-core/canvas'
import type { OverviewSectionProps } from '../types'
import { InactiveGraph } from './InactiveGraph'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const Performance = ({
  bondedPool,
  performanceKey,
  graphSyncing,
}: OverviewSectionProps) => {
  const { t } = useTranslation()
  const { openHelp } = useHelp()
  const { containerRefs } = useUi()
  const { pluginEnabled } = usePlugins()
  const { getPoolRewardPoints } = usePoolPerformance()

  const pointsByEra =
    getPoolRewardPoints(performanceKey)?.[bondedPool.addresses.stash] || {}

  // Ref to the graph container
  const graphInnerRef = useRef<HTMLDivElement | null>(null)

  // Get the size of the graph container
  const size = useSize(graphInnerRef, {
    outerElement: containerRefs?.mainInterface,
  })
  const { width, height } = formatSize(size, 150)

  return (
    <div>
      <Subheading>
        <h3>
          {t('recentPerformance', { ns: 'library' })}
          <ButtonHelp
            outline
            marginLeft
            onClick={() => openHelp('Era Points')}
          />
        </h3>
      </Subheading>

      <GraphInner ref={graphInnerRef} width={width} height={height}>
        {pluginEnabled('staking_api') ? (
          <LegacyEraPoints
            syncing={graphSyncing}
            pointsByEra={pointsByEra}
            width={width}
            height={height}
          />
        ) : (
          <>
            <StatusLabel
              status="active_service"
              statusFor="staking_api"
              title={t('common.stakingApiDisabled', { ns: 'pages' })}
              topOffset="37%"
            />
            <InactiveGraph width={width} height={height} />
          </>
        )}
      </GraphInner>
    </div>
  )
}
