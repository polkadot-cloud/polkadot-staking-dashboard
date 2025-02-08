// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import { ellipsisFn } from '@w3ux/utils'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import chroma from 'chroma-js'
import { useTheme } from 'contexts/Themes'
import { useThemeValues } from 'contexts/ThemeValues'
import { Doughnut } from 'react-chartjs-2'
import graphColors from 'styles/graphs/index.json'
import type { GeoDonutProps } from './types'

ChartJS.register(ArcElement, Tooltip, Legend)

export const GeoDonut = ({
  title,
  series = { labels: [], data: [] },
  height = 'auto',
  width = 'auto',
  legendHeight = 25,
  maxLabelLen = 3,
}: GeoDonutProps) => {
  const { mode } = useTheme()
  const { getThemeValue } = useThemeValues()

  const { labels } = series
  let { data } = series
  const isZero = data.length === 0
  const backgroundColor = isZero
    ? graphColors.inactive[mode]
    : getThemeValue('--accent-color-primary')

  const total = data.reduce((acc: number, value: number) => acc + value, 0)

  data = data.map((value: number) => (value / total) * 100)

  const options = {
    borderColor: graphColors.inactive[mode],
    hoverBorderColor: graphColors.inactive[mode],
    backgroundColor,
    hoverBackgroundColor: [backgroundColor, graphColors.inactive[mode]],
    responsive: true,
    maintainAspectRatio: false,
    spacing: 0,
    cutout: '75%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        maxHeight: legendHeight,
        labels: {
          boxWidth: 10,
          generateLabels: (chart: AnyJson) => {
            const ls =
              ChartJS.overrides.doughnut.plugins.legend.labels.generateLabels(
                chart
              )
            return ls.map((l) => {
              l.text =
                maxLabelLen && l.text.length > maxLabelLen
                  ? ellipsisFn(l.text, maxLabelLen, 'end')
                  : l.text
              return l
            })
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: AnyJson) => ` ${title}: ${context.raw.toFixed(1)} %`,
        },
      },
    },
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        // We make a gradient of N+2 colors from active to inactive, and we discard both ends N is
        // the number of datapoints to plot.
        backgroundColor: chroma
          .scale([backgroundColor, graphColors.inactive[mode]])
          .colors(data.length + 1),
        borderWidth: 0.5,
      },
    ],
  }

  return (
    <div style={{ width, height }}>
      <Doughnut options={options} data={chartData} />
    </div>
  )
}
