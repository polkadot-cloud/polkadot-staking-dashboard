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
import { Line } from 'react-chartjs-2'
import type { PayoutLineEntry } from './GraphTypes'

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

export const PayoutLine = ({
  entries,
  syncing,
  width,
  height,
  getThemeValue,
  unit,
  t,
  i18n,
  locales,
  defaultLocale,
}: {
  entries: PayoutLineEntry[]
  syncing: boolean
  width: string | number
  height: string | number
  getThemeValue: (key: string) => string
  unit: string
  t: (key: string) => string
  i18n: { resolvedLanguage: string }
  locales: Record<string, { dateFormat: any }>
  defaultLocale: string
}) => {
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
          text: t('era'),
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
          text: `${unit} ${t('reward')}`,
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
    labels: entries.map(({ start }: { start: number }) => {
      const dateFormat = locales[i18n.resolvedLanguage ?? defaultLocale]?.dateFormat
      return format(fromUnixTime(start), 'dd MMM', {
        locale: dateFormat,
      })
    }),
    datasets: [
      {
        label: t('payouts'),
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
      {syncing && (
        <div
          style={{
            position: 'absolute',
            right: '2.5rem',
            top: '-2.5rem',
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