// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import type { AnyJson } from '@w3ux/types'
import BigNumber from 'bignumber.js'
import { useHelp } from 'contexts/Help'
import { useEffect, useState } from 'react'
import { ButtonHelp } from 'ui-buttons'
import { StatCard } from 'ui-core/base'
import { Pie as PieGraph } from 'ui-graphs'
import type { PieProps } from './types'
import { StatBoxContent } from './Wrapper'

export const Pie = ({ label, stat, pieValue, tooltip, helpKey }: PieProps) => {
  const help = helpKey !== undefined
  const showTotal = !!stat?.total
  const { openHelp } = useHelp()

  const [values, setValues] = useState<AnyJson>({
    value: Number(stat?.value || 0),
    total: Number(stat?.total || 0),
  })

  useEffect(() => {
    setValues({
      value: Number(stat?.value || 0),
      total: Number(stat?.total || 0),
    })
  }, [stat])

  return (
    <StatCard>
      <StatBoxContent>
        <div className="chart">
          <PieGraph value={pieValue} size="3.2rem" />
          {tooltip ? (
            <div className="tooltip">
              <h3>{tooltip}</h3>
            </div>
          ) : null}
        </div>

        <div className="labels">
          <h3>
            <Odometer value={new BigNumber(values.value).toFormat()} />
            {stat?.unit && stat.unit}

            {showTotal ? (
              <span className="total">
                /&nbsp;
                <Odometer value={new BigNumber(values.total).toFormat()} />
                {stat?.unit || null}
              </span>
            ) : null}
          </h3>
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
