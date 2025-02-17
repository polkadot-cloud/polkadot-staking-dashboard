// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { Countdown } from 'library/Countdown'
import { ButtonHelp } from 'ui-buttons'
import { Countdown as CountdownWrapper, Stat } from 'ui-core/base'
import { Pie } from 'ui-graphs'
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
    <Stat.Card>
      <div>
        <Stat.Graphic>
          <Pie value={Number(graph.value1.toFixed(1))} size="3.2rem" />
        </Stat.Graphic>
        {tooltip && (
          <label>
            <h3>{tooltip}</h3>
          </label>
        )}
        <Stat.Content>
          <CountdownWrapper>
            <Countdown timeleft={timeleft} />
          </CountdownWrapper>
          <Stat.Subtitle>
            {label}{' '}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </Stat.Subtitle>
        </Stat.Content>
      </div>
    </Stat.Card>
  )
}
