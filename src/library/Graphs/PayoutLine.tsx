// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
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
import { planckToDot } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { getGradient } from './Utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutLine = (props: any) => {

  const { network }: any = useApi();
  const { payouts, height, background } = props;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawBorder: false,
          color: 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,255,255,0)',
        },
        ticks: {
          display: false,
          maxTicksLimit: 30,
          autoSkip: true,
        }
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: false,
        },
        grid: {
          drawBorder: false,
          color: 'rgba(238,238,238,1)',
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
        text: `${network.unit} Payouts`,
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
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
        displayColors: false,
        backgroundColor: '#333',
      }
    },
  };

  const data = {
    labels: payouts.map((item: any, index: number) => {
      return '';
    }),
    datasets: [
      {
        label: 'Price',
        // data: empty_data,
        data: payouts.map((item: any, index: number) => {
          return planckToDot(item.amount);
        }),
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        },
        backgroundColor: '#d33079',
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2,
      }
    ],
  };

  return (
    <div className='graph_line'
      style={{
        height: height === undefined ? 'auto' : height,
        background: background === undefined ? 'none' : background,
      }}>
      <Line options={options} data={data} />
    </div>
  )
}

export default PayoutLine;