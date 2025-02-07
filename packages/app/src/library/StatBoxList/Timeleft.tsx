// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { Countdown } from 'library/Countdown'
import { ButtonHelp } from 'ui-buttons'
import { StatCard } from 'ui-core/base'
import { Pie } from 'ui-graphs'
import { StatBoxContent, TimeLeftWrapper } from './Wrapper'
import type { TimeleftProps } from './types'

export const Timeleft = ({
  label,
  timeleft,
  graph,
  tooltip,
  helpKey,
}: TimeleftProps) => {
  const help = helpKey !== undefined
  const { openHelp } = useHelp()

  return (
    <StatCard>
      <StatBoxContent className="chart">
        <Pie value={Number(graph.value1.toFixed(1))} size="3.2rem" />
        {tooltip ? (
          <label>
            <h3>{tooltip}</h3>
          </label>
        ) : null}

        <div className="labels">
          <TimeLeftWrapper>
            <Countdown timeleft={timeleft} />
          </TimeLeftWrapper>
          <h4>
            {label}{' '}
            {help ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </StatBoxContent>
    </StatCard>
  )
}
