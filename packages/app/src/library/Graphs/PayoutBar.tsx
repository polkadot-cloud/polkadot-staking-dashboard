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
import { useNetwork } from 'contexts/Network'
import { useTheme } from 'contexts/Themes'
import { useThemeValues } from 'contexts/ThemeValues'
import { format, fromUnixTime } from 'date-fns'
import { DefaultLocale, locales } from 'locales'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import graphColors from 'styles/graphs/index.json'
import { Spinner } from 'ui-core/base'
import type { PayoutBarProps } from './types'
import { formatRewardsForGraphs } from './Utils'

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

export const PayoutBar = ({
  days,
  height,
  data: { payouts, poolClaims, unclaimedPayouts },
  nominating,
  inPool,
  syncing,
}: PayoutBarProps) => {
  const { i18n, t } = useTranslation('library')
  const { mode } = useTheme()
  const { getThemeValue } = useThemeValues()
  const { unit, units } = useNetwork().networkData
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

  const borderRadius = 4
  const pointRadius = 0
  const data = {
    labels: graphPayouts.map(({ timestamp }: { timestamp: number }) => {
      const dateObj = format(fromUnixTime(timestamp), 'do MMM', {
        locale: locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat,
      })
      return `${dateObj}`
    }),

    datasets: [
      {
        order: 1,
        label: t('payout'),
        data: graphPayouts.map(({ reward }: { reward: string }) => reward),
        borderColor: colorPayouts,
        backgroundColor: colorPayouts,
        pointRadius,
        borderRadius,
      },
      {
        order: 2,
        label: t('poolClaim'),
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
        label: t('unclaimedPayouts'),
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
    maxBarThickness: 15,
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
          label: ({ dataset, parsed }: TooltipItem<'bar'>) =>
            `${dataset.order === 3 ? `${t('pending')}: ` : ''}${new BigNumber(
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
          style={{ position: 'absolute', right: '2.5rem', top: '-2.5rem' }}
        />
      )}
      <Bar options={options} data={data} />
    </div>
  )
}
