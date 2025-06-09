// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { TooltipItem } from 'chart.js'
import { format, fromUnixTime } from 'date-fns'
import { Bar } from 'react-chartjs-2'
import { Spinner } from 'ui-core/base'
import { createBaseChartOptions, createTooltipConfig } from './chartUtils'
import {
  getSecondaryColor,
  getStakingColor,
  SYNCING_SPINNER_STYLE,
} from './constants'
import type { PayoutBarProps } from './types'
import { formatRewardsForGraphs } from './util'

export const PayoutBar = ({
  days,
  height,
  data: { payouts, poolClaims, unclaimedPayouts },
  nominating,
  inPool,
  syncing,
  getThemeValue,
  unit,
  units,
  dateFormat,
  labels,
}: PayoutBarProps) => {
  const staking = nominating || inPool

  // Get formatted rewards data
  const { allPayouts, allPoolClaims, allUnclaimedPayouts } =
    formatRewardsForGraphs(
      new Date(),
      days,
      units,
      payouts,
      poolClaims,
      unclaimedPayouts
    )
  const { p: graphPayouts } = allPayouts
  const { p: graphUnclaimedPayouts } = allUnclaimedPayouts
  const { p: graphPoolClaims } = allPoolClaims

  // Determine colors for payouts and pool claims
  const inPoolOnly = !nominating && inPool
  const colorPayouts = getStakingColor(getThemeValue, staking, inPoolOnly)
  const colorPoolClaims = !staking
    ? getThemeValue('--accent-color-transparent')
    : getSecondaryColor(getThemeValue)

  const borderRadius = 3.5
  const pointRadius = 0
  const data = {
    labels: graphPayouts.map(({ timestamp }: { timestamp: number }) => {
      const dateObj = format(fromUnixTime(timestamp), 'do MMM', {
        locale: dateFormat,
      })
      return `${dateObj}`
    }),

    datasets: [
      {
        order: 1,
        label: labels.payout,
        data: graphPayouts.map(({ reward }: { reward: string }) => reward),
        borderColor: colorPayouts,
        backgroundColor: colorPayouts,
        pointRadius,
        borderRadius,
      },
      {
        order: 2,
        label: labels.poolClaim,
        data: graphPoolClaims.map(({ reward }: { reward: string }) => reward),
        borderColor: colorPoolClaims,
        backgroundColor: colorPoolClaims,
        pointRadius,
        borderRadius,
      },
      {
        order: 3,
        data: graphUnclaimedPayouts.map(
          ({ reward }: { reward: string }) => reward
        ),
        label: labels.unclaimedPayouts,
        borderColor: colorPayouts,
        backgroundColor: getThemeValue('--accent-color-pending'),
        pointRadius,
        borderRadius,
      },
    ],
  }

  const options = {
    ...createBaseChartOptions(),
    barPercentage: 0.5,
    maxBarThickness: 12,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        },
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: getThemeValue('--grid-color-secondary'),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        ...createTooltipConfig(getThemeValue),
        callbacks: {
          title: () => [],
          label: ({ dataset, parsed }: TooltipItem<'bar'>) =>
            `${dataset.order === 3 ? `${labels.pending}: ` : ''}${new BigNumber(
              parsed.y
            )
              .decimalPlaces(units)
              .toFormat()} ${unit}`,
        },
      },
    },
  }

  return (
    <div
      style={{
        height: height || 'auto',
      }}
    >
      {syncing && <Spinner style={SYNCING_SPINNER_STYLE} />}
      <Bar options={options} data={data} />
    </div>
  )
}
