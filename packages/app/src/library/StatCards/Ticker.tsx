// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { Stat } from 'ui-core/base'
import type { TickerProps } from './types'

export const Ticker = ({
  label,
  value,
  helpKey,
  direction,
  primary,
  unit,
  changePercent,
}: TickerProps) => {
  const { openHelp } = useHelp()

  const tickerColor =
    direction === 'up'
      ? 'var(--status-success-color)'
      : direction === 'down'
        ? 'var(--status-danger-color)'
        : 'var(--text-color-secondary)'

  return (
    <Stat.Card>
      <div>
        <Stat.Graphic>
          <FontAwesomeIcon
            icon={faArrowUpRightDots}
            transform="grow-8"
            color="var(--accent-color-primary)"
          />
        </Stat.Graphic>
        <Stat.Content>
          <Stat.Title primary={primary}>
            <Odometer value={value} />
            {unit}
            <label
              style={{
                color: tickerColor,
              }}
            >
              {direction === 'up' && '+'}
              {changePercent}%
            </label>
          </Stat.Title>
          <Stat.Subtitle>
            {label}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </Stat.Subtitle>
        </Stat.Content>
      </div>
    </Stat.Card>
  )
}
