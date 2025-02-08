// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
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
import { useTheme } from 'contexts/Themes'
import { format, fromUnixTime } from 'date-fns'
import { DefaultLocale, locales } from 'locales'
import type { ValidatorEraPoints } from 'plugin-staking-api/types'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import graphColors from 'styles/graphs/index.json'
import { Spinner } from 'ui-core/base'

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
  entries,
  syncing,
  width,
  height,
}: {
  entries: ValidatorEraPoints[]
  syncing: boolean
  width: string | number
  height: string | number
}) => {
  const { i18n, t } = useTranslation()
  const { mode, getThemeValue } = useTheme()

  // Format reward points as an array of strings, or an empty array if syncing
  const dataset = syncing
    ? []
    : entries.map((entry) => new BigNumber(entry.points).toString())

  // Use primary color for line
  const color = getThemeValue('--accent-color-primary ')
  // Styling of axis titles
  const titleFontSpec: Partial<FontSpec> = {
    family: "'Inter', 'sans-serif'",
    weight: 'lighter',
    size: 11,
  }
  const titleStyle = {
    color: graphColors.title[mode],
    display: true,
    padding: 6,
    font: titleFontSpec,
  }

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
          color: graphColors.canvas.axis[mode],
          font: {
            size: 10,
          },
          autoSkip: true,
        },
        title: {
          ...titleStyle,
          text: `${t('date', { ns: 'base' })}`,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: graphColors.canvas.axis[mode],
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: graphColors.canvas.grid[mode],
        },
        title: {
          ...titleStyle,
          text: `${t('eraPoints', { ns: 'library' })}`,
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
    labels: entries.map(({ start }: { start: number }) => {
      const dateObj = format(fromUnixTime(start), 'do MMM', {
        locale: locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat,
      })
      return `${dateObj}`
    }),
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
      {syncing && (
        <Spinner
          style={{ position: 'absolute', right: '3rem', top: '-4rem' }}
        />
      )}
      <Line options={options} data={data} />
    </div>
  )
}
