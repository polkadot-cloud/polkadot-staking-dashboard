// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { TooltipItem } from 'chart.js'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useThemeValues } from 'contexts/ThemeValues'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import type { AveragePayoutLineProps } from './types'
import {
  calculatePayoutAverages,
  combineRewards,
  formatRewardsForGraphs,
} from './Utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const AveragePayoutLine = ({
  days,
  average,
  height,
  background,
  data: { payouts, poolClaims },
  nominating,
  inPool,
}: AveragePayoutLineProps) => {
  const { t } = useTranslation('app')
  const { getThemeValue } = useThemeValues()
  const { network } = useNetwork()
  const { unit, units } = getNetworkData(network)

  const staking = nominating || inPool
  const inPoolOnly = !nominating && inPool
  // Define the most recent date that we will show on the graph
  const fromDate = new Date()

  const { allPayouts, allPoolClaims } = formatRewardsForGraphs(
    fromDate,
    days,
    units,
    payouts,
    poolClaims,
    [] // Note: we are not using `unclaimedPayouts` here
  )
  const { p: graphPayouts, a: graphPrePayouts } = allPayouts
  const { p: graphPoolClaims, a: graphPrePoolClaims } = allPoolClaims

  // Combine payouts and pool claims into one dataset and calculate averages
  const combined = combineRewards(
    graphPayouts.map(({ reward, timestamp }) => ({
      reward,
      timestamp,
    })),
    graphPoolClaims
  )
  const preCombined = combineRewards(graphPrePayouts, graphPrePoolClaims)

  const combinedPayouts = calculatePayoutAverages(
    preCombined.concat(combined),
    fromDate,
    days,
    10
  )

  // Determine color for payouts
  const color = !staking
    ? getThemeValue('--accent-color-primary')
    : !inPoolOnly
      ? getThemeValue('--accent-color-primary')
      : getThemeValue('--accent-color-secondary')

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 30,
          autoSkip: true,
        },
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: false,
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
          label: ({ parsed }: TooltipItem<'line'>) =>
            ` ${new BigNumber(parsed.y)
              .decimalPlaces(units)
              .toFormat()} ${unit}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  }

  const data = {
    labels: combinedPayouts.map(() => ''),
    datasets: [
      {
        label: t('payout'),
        data: combinedPayouts.map(({ reward }: { reward: number }) => reward),
        borderColor: color,
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2.3,
        tension: 0.25,
        fill: false,
      },
    ],
  }

  return (
    <>
      <h5 className="secondary" style={{ paddingLeft: '1.5rem' }}>
        {average > 1 ? `${average} ${t('dayAverage')}` : null}
      </h5>
      <div
        style={{
          height: height || 'auto',
          background: background || 'none',
          marginTop: '0.6rem',
          padding: '0 0 0.5rem 1.5rem',
        }}
      >
        <Line options={options} data={data} />
      </div>
    </>
  )
}
