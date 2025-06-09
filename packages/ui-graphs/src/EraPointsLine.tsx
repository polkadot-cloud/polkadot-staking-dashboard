// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { format, fromUnixTime } from 'date-fns'
import { Line } from 'react-chartjs-2'
import { Spinner } from 'ui-core/base'
import {
  createBaseChartOptions,
  createTitleStyle,
  createTooltipConfig,
} from './chartUtils'
import { getPrimaryColor, SYNCING_SPINNER_STYLE } from './constants'
import type { EraPointsLineProps } from './types'

export const EraPointsLine = ({
  entries,
  syncing,
  width,
  height,
  getThemeValue,
  dateFormat,
  labels,
}: EraPointsLineProps) => {
  // Format reward points as an array of strings, or an empty array if syncing
  const dataset = syncing
    ? []
    : entries.map((entry) => new BigNumber(entry.points).toString())

  // Use primary color for line
  const color = getPrimaryColor(getThemeValue)
  const titleStyle = createTitleStyle(getThemeValue)

  const options = {
    ...createBaseChartOptions(),
    barPercentage: 0.3,
    maxBarThickness: 13,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: getThemeValue('--grid-canvas-axis'),
          font: {
            size: 10,
          },
          autoSkip: true,
        },
        title: {
          ...titleStyle,
          text: labels.date,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: getThemeValue('--grid-canvas-axis'),
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
          text: labels.eraPoints,
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
          label: (context: { parsed: { y: number } }) =>
            `${new BigNumber(context.parsed.y).decimalPlaces(0).toFormat()} ${labels.eraPoints}`,
        },
      },
    },
  }

  const data = {
    labels: entries.map(({ start }: { start: number }) => {
      const dateObj = format(fromUnixTime(start), 'do MMM', {
        locale: dateFormat,
      })
      return `${dateObj}`
    }),
    datasets: [
      {
        label: labels.era,
        data: dataset,
        borderColor: color,
        backgroundColor: color,
        pointRadius: 0,
        borderRadius: 3,
      },
    ],
  }

  return (
    <div
      className="inner"
      style={{
        width,
        height,
      }}
    >
      {syncing && <Spinner style={SYNCING_SPINNER_STYLE} />}
      <Line options={options} data={data} />
    </div>
  )
}
