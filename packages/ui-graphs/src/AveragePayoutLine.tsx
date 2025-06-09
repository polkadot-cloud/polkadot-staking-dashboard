// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { TooltipItem } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { createBaseChartOptions, createTooltipConfig } from './chartUtils'
import { getStakingColor, PAYOUT_AVERAGE_DAYS } from './constants'
import type { AveragePayoutLineProps } from './types'
import {
  calculatePayoutAverages,
  combineRewards,
  formatRewardsForGraphs,
} from './util'

export const AveragePayoutLine = ({
  days,
  average,
  height,
  background,
  data: { payouts, poolClaims },
  nominating,
  inPool,
  getThemeValue,
  unit,
  units,
  labels,
}: AveragePayoutLineProps) => {
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

  // Calculate combined payouts for the chart
  const combinedPayouts = calculatePayoutAverages(
    preCombined.concat(combined),
    fromDate,
    days,
    PAYOUT_AVERAGE_DAYS
  )

  // Determine color for payouts
  const color = getStakingColor(getThemeValue, staking, inPoolOnly)

  const options = {
    ...createBaseChartOptions(),
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
        ...createTooltipConfig(getThemeValue),
        callbacks: {
          title: () => [],
          label: ({ parsed }: TooltipItem<'line'>) =>
            ` ${new BigNumber(parsed.y)
              .decimalPlaces(units)
              .toFormat()} ${unit}`,
        },
      },
    },
  }

  const data = {
    labels: combinedPayouts.map(() => ''),
    datasets: [
      {
        label: labels.payout,
        data: combinedPayouts.map(({ reward }) => Number(reward)),
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
        {average > 1 ? `${average} ${labels.dayAverage}` : null}
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
