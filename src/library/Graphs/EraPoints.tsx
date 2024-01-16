// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
import { useTheme } from 'contexts/Themes';
import { graphColors } from 'styles/graphs';
import { useNetwork } from 'contexts/Network';
import type { EraPointsProps } from './types';
import type { AnyJson } from 'types';

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
  const { t } = useTranslation('library');
  const { mode } = useTheme();
  const { colors } = useNetwork().networkData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(0,0,0,0)',
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
        border: {
          display: false,
        },
        grid: {
          color: graphColors.grid[mode],
        },
        ticks: {
          display: true,
          beginAtZero: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: t('eraPoints'),
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
          label: (context: AnyJson) => `${context.parsed.y}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels: items.map(({ era }: { era: string }) => era),
    datasets: [
      {
        label: t('points'),
        data: items.map(
          ({ reward_point }: { reward_point: string }) => reward_point
        ),
        borderColor: colors.primary[mode],
        backgroundColor: colors.primary[mode],
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
