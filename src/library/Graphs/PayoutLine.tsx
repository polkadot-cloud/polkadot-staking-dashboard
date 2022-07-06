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
import { formatRewardsForGraphs } from './Utils';

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
  const { days, height, background } = props;

  const { mode } = useTheme();
  const { network } = useApi();
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership } = usePoolMemberships();
  const { payouts, poolClaims } = useSubscan();

  const { units } = network;
  const notStaking = !isSyncing && inSetup() && !membership;
  const stakingAndPooling = !isSyncing && !inSetup() && membership !== null;

  const { payoutsByDay, poolClaimsByDay } = formatRewardsForGraphs(
    days,
    units,
    payouts,
    poolClaims
  );

  // determine color for payouts
  const colorPayouts = notStaking
    ? networkColorsTransparent[`${network.name}-${mode}`]
    : networkColors[`${network.name}-${mode}`];

  // determine color for poolClaims
  const colorPoolClaims = notStaking
    ? networkColorsTransparent[`${network.name}-${mode}`]
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
      title: {
        display: false,
        text: `${network.unit} Payouts`,
      },
      tooltip: {
        displayColors: stakingAndPooling,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
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

  // configure payout dataset
  let datasets = [
    {
      label: 'Payout',
      data: payoutsByDay.map((item: AnySubscan) => {
        return item.amount;
      }),
      borderColor: colorPayouts,
      backgroundColor: colorPayouts,
      pointStyle: undefined,
      pointRadius: 0,
      borderWidth: 2,
    },
  ];
  // if finished syncing and pooling, add pools dataset
  if (!isSyncing && membership !== null) {
    datasets.push({
      label: 'Pool Claim',
      data: poolClaimsByDay.map((item: AnySubscan) => {
        return item.amount;
      }),
      borderColor: colorPoolClaims,
      backgroundColor: colorPoolClaims,
      pointStyle: undefined,
      pointRadius: 0,
      borderWidth: 2,
    });
  }
  // if synced, pooling and not staking, remove payout dataset
  if (!isSyncing && membership !== null && inSetup()) {
    datasets = datasets.filter((d: AnySubscan) => d.label !== 'Payout');
  }

  const data = {
    labels: payoutsByDay.map(() => {
      return '';
    }),
    datasets,
  };

  return (
    <div
      className="graph_line"
      style={{
        height: height === undefined ? 'auto' : height,
        background: background === undefined ? 'none' : background,
      }}
    >
      <Line options={options} data={data} />
    </div>
  );
};

export default PayoutLine;
