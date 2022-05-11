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
import { getGradient } from './Utils';
import { defaultThemes } from '../../theme/default';
import { useTheme } from '../../contexts/Themes';

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

  const { mode } = useTheme();
  let { items, height } = props;

  items = items === undefined ? [] : items;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawBorder: false,
          color: defaultThemes.transparent[mode],
          borderColor: defaultThemes.transparent[mode],
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
        text: `Era Points`,
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
            return `${context.parsed.y}`;
          },
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
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
        backgroundColor: defaultThemes.graphs.colors[0][mode],
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