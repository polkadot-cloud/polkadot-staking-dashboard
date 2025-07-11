// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { FontSpec } from 'chart.js'
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
import { Line } from 'react-chartjs-2'
import { Spinner } from 'ui-core/base'
import type { PayoutLineProps } from '../types'
import { deepEqual } from '../util/deepEqual'

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

const PayoutLineComponent = ({
  entries,
  syncing,
  width,
  height,
  getThemeValue,
  unit,
  dateFormat,
  labels,
}: PayoutLineProps) => {
  // Format reward points as an array of strings, or an empty array if syncing
  const dataset = syncing
    ? []
    : entries.map((entry) => new BigNumber(entry.reward).toString())

  // Use primary color for line
  const color = getThemeValue('--accent-color-primary')

  // Styling of axis titles
  const titleFontSpec: Partial<FontSpec> = {
    family: "'Inter', 'sans-serif'",
    weight: 'lighter',
    size: 11,
  }
  const titleStyle = {
    display: true,
    ...titleFontSpec,
    color: getThemeValue('--text-color-secondary'),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        },
        title: {
          ...titleStyle,
          text: labels.era,
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: getThemeValue('--grid-canvas'),
        },
        title: {
          ...titleStyle,
          text: `${unit} ${labels.reward}`,
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
          label: (context: { parsed: { y: number } }) =>
            `${new BigNumber(context.parsed.y).toFormat()} ${unit}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  }

  const data = {
    labels: entries.map(({ start }: { start: number }) =>
      format(fromUnixTime(start), 'dd MMM', {
        locale: dateFormat,
      })
    ),
    datasets: [
      {
        label: labels.payouts,
        data: dataset,
        borderColor: color,
        backgroundColor: color,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  }

  return (
    <div
      style={{
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      {syncing && (
        <Spinner
          style={{ position: 'absolute', right: '3rem', top: '-4rem' }}
        />
      )}
      <Line options={options} data={data} />
    </div>
  )
}

// Custom comparison function to prevent expensive Chart.js re-initializations
const arePropsEqual = (
  prevProps: PayoutLineProps,
  nextProps: PayoutLineProps
): boolean => {
  // Check syncing state
  if (prevProps.syncing !== nextProps.syncing) {
    return false
  }

  // Check dimensions
  if (
    prevProps.width !== nextProps.width ||
    prevProps.height !== nextProps.height
  ) {
    return false
  }

  // Check styling props
  if (
    prevProps.unit !== nextProps.unit ||
    prevProps.dateFormat !== nextProps.dateFormat
  ) {
    return false
  }

  // Check labels object using deepEqual instead of JSON.stringify
  if (!deepEqual(prevProps.labels, nextProps.labels)) {
    return false
  }

  // Check entries data (most important for chart updates)
  if (
    prevProps.entries.length !== nextProps.entries.length ||
    !deepEqual(prevProps.entries, nextProps.entries)
  ) {
    return false
  }

  // Theme changes are harder to detect, but we can check if the function reference changed
  // This isn't perfect but prevents most unnecessary re-renders
  if (prevProps.getThemeValue !== nextProps.getThemeValue) {
    return false
  }

  return true
}

export const PayoutLine = memo(PayoutLineComponent, arePropsEqual)
PayoutLine.displayName = 'PayoutLine'
