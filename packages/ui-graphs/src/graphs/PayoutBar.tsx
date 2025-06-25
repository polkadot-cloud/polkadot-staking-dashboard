// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { TooltipItem } from 'chart.js'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { format, fromUnixTime } from 'date-fns'
import { memo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Spinner } from 'ui-core/base'
import type { PayoutBarProps } from '../types'
import { deepEqual } from '../util/deepEqual'
import { formatRewardsForGraphs } from '../util/index'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const PayoutBarComponent = ({
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

  // Determine color for payouts
  const colorPayouts = !staking
    ? getThemeValue('--accent-color-transparent')
    : getThemeValue('--accent-color-primary')

  // Determine color for poolClaims
  const colorPoolClaims = !staking
    ? getThemeValue('--accent-color-transparent')
    : getThemeValue('--accent-color-secondary')

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
    responsive: true,
    maintainAspectRatio: false,
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
        displayColors: false,
        backgroundColor: getThemeValue('--background-invert'),
        titleColor: getThemeValue('--text-color-invert'),
        bodyColor: getThemeValue('--text-color-invert'),
        bodyFont: {
          weight: 600,
        },
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
      {syncing && (
        <Spinner
          style={{ position: 'absolute', right: '3rem', top: '-4rem' }}
        />
      )}
      <Bar options={options} data={data} />
    </div>
  )
}

// Custom comparison function to prevent expensive Chart.js re-initializations
const arePropsEqual = (
  prevProps: PayoutBarProps,
  nextProps: PayoutBarProps
): boolean => {
  // Check syncing state
  if (prevProps.syncing !== nextProps.syncing) {
    return false
  }

  // Check dimensions and configuration
  if (
    prevProps.days !== nextProps.days ||
    prevProps.height !== nextProps.height ||
    prevProps.nominating !== nextProps.nominating ||
    prevProps.inPool !== nextProps.inPool
  ) {
    return false
  }

  // Check styling props
  if (
    prevProps.unit !== nextProps.unit ||
    prevProps.units !== nextProps.units ||
    prevProps.dateFormat !== nextProps.dateFormat
  ) {
    return false
  }

  // Check labels object using deepEqual instead of JSON.stringify
  if (!deepEqual(prevProps.labels, nextProps.labels)) {
    return false
  }

  // Check data object (most important for chart updates)
  if (!deepEqual(prevProps.data, nextProps.data)) {
    return false
  }

  // Theme changes detection
  if (prevProps.getThemeValue !== nextProps.getThemeValue) {
    return false
  }

  return true
}

export const PayoutBar = memo(PayoutBarComponent, arePropsEqual)
PayoutBar.displayName = 'PayoutBar'
