// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { graphColors } from 'styles/graphs';
import type { AnyJson, AnySubscan } from 'types';
import { useNetwork } from 'contexts/Network';
import type { PayoutLineProps } from './types';
import {
  calculatePayoutAverages,
  combineRewards,
  formatRewardsForGraphs,
} from './Utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutLine = ({
  days,
  average,
  height,
  background,
  data: { payouts, poolClaims },
}: PayoutLineProps) => {
  const { t } = useTranslation('library');
  const { mode } = useTheme();
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { unit, units, colors } = useNetwork().networkData;
  const { membership: poolMembership } = usePoolMemberships();

  const notStaking = !isSyncing && inSetup() && !poolMembership;
  const poolingOnly = !isSyncing && inSetup() && poolMembership !== null;

  // remove slashes from payouts (graph does not support negative values).
  const payoutsNoSlash = payouts?.filter((p) => p.event_id !== 'Slashed') || [];

  // define the most recent date that we will show on the graph.
  const fromDate = new Date();

  const { allPayouts, allPoolClaims } = formatRewardsForGraphs(
    fromDate,
    days,
    units,
    payoutsNoSlash,
    poolClaims,
    [] // Note: we are not using `unclaimedPayouts` here.
  );

  const { p: graphPayouts, a: graphPrePayouts } = allPayouts;
  const { p: graphPoolClaims, a: graphPrePoolClaims } = allPoolClaims;

  // combine payouts and pool claims into one dataset and calculate averages.
  const combined = combineRewards(graphPayouts, graphPoolClaims);
  const preCombined = combineRewards(graphPrePayouts, graphPrePoolClaims);

  const combinedPayouts = calculatePayoutAverages(
    preCombined.concat(combined),
    fromDate,
    days,
    10
  );

  // determine color for payouts
  const color = notStaking
    ? colors.primary[mode]
    : !poolingOnly
      ? colors.primary[mode]
      : colors.secondary[mode];

  // configure graph options
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
          color: graphColors.grid[mode],
        },
      },
    },
    plugins: {
      legend: {
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
            ` ${new BigNumber(context.parsed.y)
              .decimalPlaces(units)
              .toFormat()} ${unit}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels: combinedPayouts.map(() => ''),
    datasets: [
      {
        label: t('payout'),
        data: combinedPayouts.map((item: AnySubscan) => item?.amount ?? 0),
        borderColor: color,
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2.3,
        tension: 0.25,
        fill: false,
      },
    ],
  };

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
  );
};
