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
import { planckToUnit } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { getGradient } from './Utils';
import { defaultThemes } from '../../theme/default';
import { useTheme } from '../../contexts/Themes';

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

export const PayoutBar = (props: any) => {
  const { network }: any = useApi();
  const { units } = network;
  const { mode } = useTheme();
  const { payouts, height } = props;

  const data = {
    labels: payouts.map((item: any, index: number) => {
      return moment.unix(item.block_timestamp).format('Do MMM');
    }),
    datasets: [
      {
        label: 'Price',
        // data: empty_data,
        data: payouts.map((item: any, index: number) => {
          return planckToUnit(item.amount, units);
        }),
        borderColor: defaultThemes.graphs.colors[0][mode],
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        },
        pointRadius: 0,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.28,
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
            return `${context.parsed.y} ${network.unit}`;
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
