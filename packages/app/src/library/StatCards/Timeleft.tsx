// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { Countdown } from 'library/Countdown'
import { ButtonHelp } from 'ui-buttons'
import {
  Countdown as CountdownWrapper,
  StatCard,
  StatGraphic,
} from 'ui-core/base'
import { Pie } from 'ui-graphs'
import { StatContent } from './Wrapper'
import type { TimeleftProps } from './types'

export const Timeleft = ({
  label,
  timeleft,
  graph,
  tooltip,
  helpKey,
}: TimeleftProps) => {
  const { openHelp } = useHelp()

  return (
    <StatCard>
      <StatContent className="chart">
        <StatGraphic>
          <Pie value={Number(graph.value1.toFixed(1))} size="3.2rem" />
        </StatGraphic>
        {tooltip && (
          <label>
            <h3>{tooltip}</h3>
          </label>
        )}
        <div className="labels">
          <CountdownWrapper>
            <Countdown timeleft={timeleft} />
          </CountdownWrapper>
          <h4>
            {label}{' '}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </StatContent>
    </StatCard>
  )
}
