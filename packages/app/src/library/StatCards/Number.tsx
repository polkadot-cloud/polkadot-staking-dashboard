// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import BigNumber from 'bignumber.js'
import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { StatCard, StatSubtitle, StatTitle } from 'ui-core/base'
import type { NumberProps } from './types'
import { StatContent } from './Wrapper'

export const Number = ({
  label,
  value,
  unit,
  helpKey,
  decimals,
}: NumberProps) => {
  const { openHelp } = useHelp()

  return (
    <StatCard>
      <StatContent>
        <div className="labels">
          <StatTitle>
            <Odometer
              value={new BigNumber(value)
                .decimalPlaces(decimals || 0)
                .toFormat()}
            />
            {unit || null}
          </StatTitle>
          <StatSubtitle>
            {label}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </StatSubtitle>
        </div>
      </StatContent>
    </StatCard>
  )
}
