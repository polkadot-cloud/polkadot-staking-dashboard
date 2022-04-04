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

export const EraPoints = (props: any) => {

  const { items, height } = props;

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
          display: true,
          maxTicksLimit: 30,
          autoSkip: true,
        },
        title: {
          display: true,
          text: 'Era',
          font: {
            size: 14,
          }
        }
      },
      y: {
        ticks: {
          display: true,
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
        text: `Era Points`,
      },
      tooltip: {
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return `${context.parsed.y}`;
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
    labels: items.map((item: any, index: number) => {
      return item.era;
    }),
    datasets: [
      {
        label: 'Points',
        // data: empty_data,
        data: items.map((item: any, index: number) => {
          return item.reward_point;
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
    <div
      style={{
        height: height === undefined ? 'auto' : height,
      }}>
      <Line options={options} data={data} />
    </div>
  )
}

export default EraPoints;