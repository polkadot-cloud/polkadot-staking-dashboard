// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import BigNumber from 'bignumber.js'
import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { StatCard } from 'ui-core/base'
import { Pie as PieGraph } from 'ui-graphs'
import type { PieProps } from './types'
import { StatBoxContent } from './Wrapper'

export const Pie = ({ label, stat, pieValue, tooltip, helpKey }: PieProps) => {
  const showTotal = !!stat?.total
  const { openHelp } = useHelp()

  return (
    <StatCard>
      <StatBoxContent className="chart">
        <PieGraph value={pieValue} size="3.2rem" />
        {tooltip && (
          <label>
            <h3>{tooltip}</h3>
          </label>
        )}
        <div className="labels">
          <h3>
            <Odometer value={new BigNumber(stat.value).toFormat()} />
            {stat?.unit && stat.unit}

            {showTotal ? (
              <span className="total">
                /&nbsp;
                <Odometer value={new BigNumber(stat?.total || 0).toFormat()} />
                {stat?.unit || null}
              </span>
            ) : null}
          </h3>
          <h4>
            {label}{' '}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </StatBoxContent>
    </StatCard>
  )
}
