// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
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
import { planckToDot } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { getGradient } from './Utils';

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
          return planckToDot(item.amount);
        }),
        borderColor: '#d33079',
        backgroundColor: (context: any) => {
          const chart = context.chart;
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
    scales: {
      x: {
        grid: {
          drawBorder: true,
          color: 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,255,255,0)',
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        }
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#eee',
          borderColor: 'rgba(255,255,255,0)',
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
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return `${context.parsed.y} ${network.unit}`;
          },
        },
        displayColors: false,
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
  )
}

export default PayoutBar;