// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { defaultThemes, networkColors } from 'theme/default';
import { EraPointsProps } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EraPoints = ({ items = [], height }: EraPointsProps) => {
  const { mode } = useTheme();
  const { name } = useApi().network;
  const { t } = useTranslation('common');

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
            size: 10,
          },
        },
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
        text: t('library.era_points'),
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
          label: (context: any) => `${context.parsed.y}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels: items.map((item: any) => item.era),
    datasets: [
      {
        label: t('library.points'),
        data: items.map((item: any) => item.reward_point),
        borderColor: networkColors[`${name}-${mode}`],
        backgroundColor: networkColors[`${name}-${mode}`],
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        height: height || 'auto',
      }}
    >
      <Line options={options} data={data} />
    </div>
  );
};

export default EraPoints;
