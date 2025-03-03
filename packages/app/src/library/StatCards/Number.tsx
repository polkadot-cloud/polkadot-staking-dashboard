// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import BigNumber from 'bignumber.js'
import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { Stat } from 'ui-core/base'
import type { NumberProps } from './types'

export const Number = ({
  label,
  value,
  unit,
  helpKey,
  decimals,
}: NumberProps) => {
  const { openHelp } = useHelp()

  return (
    <Stat.Card>
      <div>
        <Stat.Content>
          <Stat.Title>
            <Odometer
              value={new BigNumber(value)
                .decimalPlaces(decimals || 0)
                .toFormat()}
            />
            {unit || null}
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
