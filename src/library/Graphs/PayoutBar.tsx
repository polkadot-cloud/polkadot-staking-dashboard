// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApi } from 'contexts/Api';
import {
  defaultThemes,
  networkColors,
  networkColorsTransparent,
} from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { humanNumber } from 'Utils';
import { useUi } from 'contexts/UI';
import { useStaking } from 'contexts/Staking';
import { PayoutBarProps } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutBar = (props: PayoutBarProps) => {
  const { mode } = useTheme();
  const { network } = useApi();
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();
  const { payouts, height } = props;

  const color = notStaking
    ? networkColorsTransparent[`${network.name}-${mode}`]
    : networkColors[`${network.name}-${mode}`];

  const data = {
    labels: payouts.map((item: any) => {
      return moment.unix(item.block_timestamp).format('Do MMM');
    }),
    datasets: [
      {
        label: 'Price',
        // data: empty_data,
        data: payouts.map((item: any) => {
          return item.amount;
        }),
        borderColor: color,
        backgroundColor: color,
        pointRadius: 0,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.4,
    maxBarThickness: 11,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: true,
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
        grid: {
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
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return `${humanNumber(context.parsed.y)} ${network.unit}`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        height: height === undefined ? 'auto' : height,
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
};

export default PayoutBar;
