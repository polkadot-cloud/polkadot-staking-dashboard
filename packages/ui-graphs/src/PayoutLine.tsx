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
import type { PayoutLineProps } from './types'

export const PayoutLine = ({
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
  const color = getPrimaryColor(getThemeValue)
  const titleStyle = createTitleStyle(getThemeValue)

  const options = {
    ...createBaseChartOptions(),
    interaction: {
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 10,
        radius: 2,
      },
    },
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
        ...createTooltipConfig(getThemeValue),
        callbacks: {
          title: () => [],
          label: (context: { parsed: { y: number } }) =>
            `${new BigNumber(context.parsed.y).toFormat()} ${unit}`,
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
        pointStyle: 'circle',
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
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
      {syncing && <Spinner style={SYNCING_SPINNER_STYLE} />}
      <Line options={options} data={data} />
    </div>
  )
}
