// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import BigNumber from 'bignumber.js'
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
import { useNetwork } from 'contexts/Network'
import { useTheme } from 'contexts/Themes'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import graphColors from 'styles/graphs/index.json'
import type { PointsByEra } from 'types'

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

export const EraPointsLine = ({
  pointsByEra,
  syncing,
  width,
  height,
}: {
  pointsByEra: PointsByEra
  syncing: boolean
  width: string | number
  height: string | number
}) => {
  const { t } = useTranslation()
  const { mode } = useTheme()
  const { colors } = useNetwork().networkData

  // Format reward points as an array of strings, or an empty array if syncing
  const dataset = syncing
    ? []
    : Object.values(
        Object.fromEntries(
          Object.entries(pointsByEra).map(([k, v]) => [
            k,
            new BigNumber(v).toString(),
          ])
        )
      )

  // Format labels, only displaying the first and last era
  const labels = Object.keys(pointsByEra).map(() => '')
  const firstEra = Object.keys(pointsByEra)[0]
  labels[0] = firstEra
    ? `${t('era', { ns: 'library' })} ${Object.keys(pointsByEra)[0]}`
    : ''
  const lastEra = Object.keys(pointsByEra)[labels.length - 1]
  labels[labels.length - 1] = lastEra
    ? `${t('era', { ns: 'library' })} ${Object.keys(pointsByEra)[labels.length - 1]}`
    : ''

  // Use primary color for bars
  const color = colors.primary[mode]

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.3,
    maxBarThickness: 13,
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
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: graphColors.grid[mode],
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
        backgroundColor: graphColors.tooltip[mode],
        titleColor: graphColors.label[mode],
        bodyColor: graphColors.label[mode],
        bodyFont: {
          weight: 600,
        },
        callbacks: {
          title: () => [],
          label: (context: AnyJson) =>
            `${new BigNumber(context.parsed.y).decimalPlaces(0).toFormat()} ${t('eraPoints', { ns: 'library' })}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  }

  const data = {
    labels,
    datasets: [
      {
        label: t('era', { ns: 'library' }),
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
      <Line options={options} data={data} />
    </div>
  )
}
