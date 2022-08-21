// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApi } from 'contexts/Api';
import {
  defaultThemes,
  networkColors,
  networkColorsSecondary,
  networkColorsTransparent,
} from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { humanNumber } from 'Utils';
import { useUi } from 'contexts/UI';
import { useStaking } from 'contexts/Staking';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { AnySubscan } from 'types';
import { useSubscan } from 'contexts/Subscan';
import { PayoutLineProps } from './types';
import { combineRewardsByDay, formatRewardsForGraphs } from './Utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutLine = (props: PayoutLineProps) => {
  const { days, average, height, background } = props;

  const { mode } = useTheme();
  const { network } = useApi();
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership: poolMembership } = usePoolMemberships();
  const { payouts, poolClaims } = useSubscan();

  const { units } = network;
  const notStaking = !isSyncing && inSetup() && !poolMembership;
  const poolingOnly = !isSyncing && inSetup() && poolMembership !== null;

  const { payoutsByDay, poolClaimsByDay } = formatRewardsForGraphs(
    days,
    average,
    units,
    payouts,
    poolClaims
  );

  // combine payouts and pool claims into one dataset
  const combinedPayouts = combineRewardsByDay(payoutsByDay, poolClaimsByDay);

  // determine color for payouts
  const color = notStaking
    ? networkColorsTransparent[`${network.name}-${mode}`]
    : !poolingOnly
    ? networkColors[`${network.name}-${mode}`]
    : networkColorsSecondary[`${network.name}-${mode}`];

  // configure graph options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
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
        grid: {
          drawBorder: false,
          color: defaultThemes.graphs.grid[mode],
          borderColor: defaultThemes.transparent[mode],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        bodyFont: {
          weight: '600',
        },
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return ` ${humanNumber(context.parsed.y)} ${network.unit}`;
          },
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels: payoutsByDay.map(() => {
      return '';
    }),
    datasets: [
      {
        label: 'Payout',
        data: combinedPayouts.map((item: AnySubscan) => {
          return item?.amount ?? 0;
        }),
        borderColor: color,
        backgroundColor: color,
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <h5 className="secondary">
        {average > 1 ? `${average} Day Average` : <>&nbsp;</>}
      </h5>
      <div
        className="graph_line"
        style={{
          height: height === undefined ? 'auto' : height,
          background: background === undefined ? 'none' : background,
        }}
      >
        <Line options={options} data={data} />
      </div>
    </>
  );
};

export default PayoutLine;
