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
import type { Locale } from 'date-fns'
import { format, fromUnixTime } from 'date-fns'
import { Line } from 'react-chartjs-2'

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

export interface ValidatorEraPoints {
  era: number
  points: string
  start: number
}

export const EraPointsLine = ({
  entries,
  syncing,
  width,
  height,
  getThemeValue,
  t,
  i18n,
  locales,
  defaultLocale,
}: {
  entries: ValidatorEraPoints[]
  syncing: boolean
  width: string | number
  height: string | number
  getThemeValue: (key: string) => string
  t: (key: string) => string
  i18n: { resolvedLanguage?: string }
  locales: Record<string, { dateFormat: Locale }>
  defaultLocale: string
}) => {
  // Format reward points as an array of strings, or an empty array if syncing
  const dataset = syncing
    ? []
    : entries.map((entry) => new BigNumber(entry.points).toString())

  // Use primary color for line
  const color = getThemeValue('--accent-color-primary')
  // Styling of axis titles
  const titleFontSpec: Partial<FontSpec> = {
    family: "'Inter', 'sans-serif'",
    weight: 'lighter',
    size: 11,
  }
  const titleStyle = {
    color: getThemeValue('--text-color-secondary'),
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
          color: getThemeValue('--grid-canvas-axis'),
          font: {
            size: 10,
          },
          autoSkip: true,
        },
        title: {
          ...titleStyle,
          text: `${t('date')}`,
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
          text: `${t('eraPoints')}`,
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
            `${new BigNumber(context.parsed.y).decimalPlaces(0).toFormat()} ${t('eraPoints')}`,
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
      const dateFormat =
        locales[i18n.resolvedLanguage ?? defaultLocale]?.dateFormat
      const dateObj = format(fromUnixTime(start), 'do MMM', {
        locale: dateFormat,
      })
      return `${dateObj}`
    }),
    datasets: [
      {
        label: t('era'),
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
        <div
          style={{
            position: 'absolute',
            right: '3rem',
            top: '-4rem',
            width: '16px',
            height: '16px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      <Line options={options} data={data} />
    </div>
  )
}
