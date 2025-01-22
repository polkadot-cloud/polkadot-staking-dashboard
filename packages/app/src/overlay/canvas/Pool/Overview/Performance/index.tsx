// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import BigNumber from 'bignumber.js'
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
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useUi } from 'contexts/UI'
import { formatSize } from 'library/Graphs/Utils'
import { StatusLabel } from 'library/StatusLabel'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { GraphInner, Subheading } from 'ui-core/canvas'
import type { OverviewSectionProps } from '../../types'
import { ActiveGraph } from './ActiveGraph'
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

export const Performance = ({ bondedPool }: OverviewSectionProps) => {
  const { activeEra } = useApi()
  const { t } = useTranslation()
  const { openHelp } = useHelp()
  const { network } = useNetwork()
  const { containerRefs } = useUi()
  const { pluginEnabled } = usePlugins()

  // Ref to the graph container
  const graphInnerRef = useRef<HTMLDivElement | null>(null)

  // Get the size of the graph container
  const size = useSize(graphInnerRef, {
    outerElement: containerRefs?.mainInterface,
  })
  const { width, height } = formatSize(size, 250)

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
          <ActiveGraph
            network={network}
            poolId={Number(bondedPool.id)}
            fromEra={BigNumber.max(activeEra.index.minus(1), 0).toNumber()}
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
