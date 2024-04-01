// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useNetwork } from 'contexts/Network';
import { GraphWrapper, HeadingWrapper } from '../Wrappers';
import { Bar } from 'react-chartjs-2';
import BigNumber from 'bignumber.js';
import type { AnyJson } from 'types';
import { graphColors } from 'theme/graphs';
import { useTheme } from 'contexts/Themes';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';

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

export const RecentPerformance = () => {
  const { mode } = useTheme();
  const { openHelp } = useHelp();
  const { colors } = useNetwork().networkData;

  const color = colors.primary[mode];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.3,
    maxBarThickness: 13,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        },
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: graphColors.grid[mode],
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
        backgroundColor: graphColors.tooltip[mode],
        titleColor: graphColors.label[mode],
        bodyColor: graphColors.label[mode],
        bodyFont: {
          weight: 600,
        },
        callbacks: {
          title: () => [],
          label: (context: AnyJson) =>
            `${new BigNumber(context.parsed.y).decimalPlaces(0).toFormat()} Era Points`,
        },
      },
    },
  };

  const data = {
    labels: [
      'Era 1,123',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Era 1,340',
    ],
    datasets: [
      {
        label: 'Era Points',
        data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 100, 90, 80, 80],
        borderColor: color,
        backgroundColor: color,
        pointRadius: 0,
        borderRadius: 3,
      },
    ],
  };

  return (
    <>
      <HeadingWrapper style={{ marginTop: '1.75rem' }}>
        <h3>
          Recent Performance
          <ButtonHelp
            outline
            marginLeft
            onClick={() => openHelp('Era Points')}
          />
        </h3>
      </HeadingWrapper>
      <GraphWrapper>
        <Bar options={options} data={data} />
      </GraphWrapper>
    </>
  );
};
