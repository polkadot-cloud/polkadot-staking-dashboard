// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { BarSegment } from './BarSegment'
import { LegendItem } from './LegendItem'
import type { BondedChartProps } from './types'
import { Bar, BarChartWrapper, Legend } from './Wrappers'

export const BondedChart = ({
  active,
  free,
  unlocking,
  unlocked,
  inactive,
  lessPadding,
  style,
  labels,
  unit,
  units,
  onHelpClick,
}: BondedChartProps) => {
  const totalUnlocking = unlocking + unlocked
  const total = active + totalUnlocking + free

  // Calculate percentages for the graph
  const graphActive = total > 0n ? Number((active * 100n) / total) : 0

  const graphUnlocking =
    total > 0n ? Number((totalUnlocking * 100n) / total) : 0

  const graphFree = total > 0n ? Number((free * 100n) / total) : 0

  // Ensure minimum percentage for visibility when there's a balance
  const MinimumLowerBound = 0.01
  const MinimumNoNZeroPercent = 5

  const adjustedGraphFree =
    free > 0n && graphFree < MinimumLowerBound
      ? MinimumNoNZeroPercent
      : graphFree

  const finalStyle = {
    marginTop: '2rem',
    marginBottom: '2rem',
    ...(style || {}),
  }

  // Format display values
  const formatValue = (value: bigint): string => {
    const formatted = planckToUnit(value.toString(), units)
    return Number(formatted).toFixed(3)
  }

  return (
    <BarChartWrapper lessPadding={lessPadding} style={finalStyle}>
      <Legend>
        {totalUnlocking + active === 0n ? (
          <LegendItem
            dataClass="d4"
            label={labels.available}
            onHelpClick={onHelpClick}
          />
        ) : active > 0n ? (
          <LegendItem
            dataClass="d1"
            label={labels.bonded}
            onHelpClick={onHelpClick}
          />
        ) : null}

        {totalUnlocking > 0n ? (
          <LegendItem
            dataClass="d3"
            label={labels.unlocking}
            onHelpClick={onHelpClick}
          />
        ) : null}

        {totalUnlocking + active > 0n ? (
          <LegendItem
            dataClass="d4"
            label={labels.free}
            onHelpClick={onHelpClick}
          />
        ) : null}
      </Legend>
      <Bar>
        <BarSegment
          dataClass="d1"
          widthPercent={graphActive}
          flexGrow={0}
          label={`${formatValue(active)} ${unit}`}
        />
        <BarSegment
          dataClass="d3"
          widthPercent={graphUnlocking}
          flexGrow={0}
          label={`${formatValue(totalUnlocking)} ${unit}`}
        />
        <BarSegment
          dataClass="d4"
          widthPercent={adjustedGraphFree}
          flexGrow={0}
          label={`${formatValue(free)} ${unit}`}
          forceShow={inactive && totalUnlocking === 0n}
        />
      </Bar>
    </BarChartWrapper>
  )
}
