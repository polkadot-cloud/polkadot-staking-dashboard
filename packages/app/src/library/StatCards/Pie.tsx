// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import BigNumber from 'bignumber.js'
import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import {
  StatCard,
  StatContent,
  StatGraphic,
  StatSubtitle,
  StatTitle,
  StatTotal,
} from 'ui-core/base'
import { Pie as PieGraph } from 'ui-graphs'
import type { PieProps } from './types'

export const Pie = ({ label, stat, pieValue, tooltip, helpKey }: PieProps) => {
  const showTotal = !!stat?.total
  const { openHelp } = useHelp()

  return (
    <StatCard>
      <div>
        <StatGraphic>
          <PieGraph value={pieValue} size="3.2rem" />
        </StatGraphic>
        {tooltip && (
          <label>
            <h3>{tooltip}</h3>
          </label>
        )}
        <StatContent>
          <StatTitle>
            <Odometer value={new BigNumber(stat.value).toFormat()} />
            {stat?.unit && stat.unit}

            {showTotal ? (
              <StatTotal>
                /&nbsp;
                <Odometer value={new BigNumber(stat?.total || 0).toFormat()} />
                {stat?.unit || null}
              </StatTotal>
            ) : null}
          </StatTitle>
          <StatSubtitle>
            {label}{' '}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </StatSubtitle>
        </StatContent>
      </div>
    </StatCard>
  )
}
