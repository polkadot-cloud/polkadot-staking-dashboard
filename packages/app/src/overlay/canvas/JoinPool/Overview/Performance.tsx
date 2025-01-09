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
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance'
import { useUi } from 'contexts/UI'
import { EraPointsLine } from 'library/Graphs/EraPointsLine'
import { formatSize } from 'library/Graphs/Utils'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { GraphInner, Subheading } from 'ui-core/canvas'
import type { OverviewSectionProps } from '../types'

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
        <EraPointsLine
          syncing={graphSyncing}
          pointsByEra={pointsByEra}
          width={width}
          height={height}
        />
      </GraphInner>
    </div>
  )
}
