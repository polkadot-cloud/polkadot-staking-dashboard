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
import { Line } from 'react-chartjs-2';
import BigNumber from 'bignumber.js';
import type { AnyJson } from 'types';
import { graphColors } from 'theme/graphs';
import { useTheme } from 'contexts/Themes';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { useRef } from 'react';
import { formatSize } from 'library/Graphs/Utils';
import { useSize } from 'hooks/useSize';
import type { OverviewSectionProps } from '../types';
import { useTranslation } from 'react-i18next';

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

export const PerformanceGraph = ({
  bondedPool,
  performanceKey,
  graphSyncing,
}: OverviewSectionProps) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const { openHelp } = useHelp();
  const { colors } = useNetwork().networkData;
  const { getPoolRewardPoints } = usePoolPerformance();

  const poolRewardPoints = getPoolRewardPoints(performanceKey);
  const rawEraRewardPoints = poolRewardPoints[bondedPool.addresses.stash] || {};

  // Ref to the graph container.
  const graphInnerRef = useRef<HTMLDivElement>(null);

  // Get the size of the graph container.
  const size = useSize(graphInnerRef?.current || undefined);
  const { width, height } = formatSize(size, 150);

  // Format reward points as an array of strings, or an empty array if syncing.
  const dataset = graphSyncing
    ? []
    : Object.values(
        Object.fromEntries(
          Object.entries(rawEraRewardPoints).map(([k, v]: AnyJson) => [
            k,
            new BigNumber(v).toString(),
          ])
        )
      );

  // Format labels, only displaying the first and last era.
  const labels = Object.keys(rawEraRewardPoints).map(() => '');

  const firstEra = Object.keys(rawEraRewardPoints)[0];
  labels[0] = firstEra
    ? `${t('era', { ns: 'library' })} ${Object.keys(rawEraRewardPoints)[0]}`
    : '';

  const lastEra = Object.keys(rawEraRewardPoints)[labels.length - 1];
  labels[labels.length - 1] = lastEra
    ? `${t('era', { ns: 'library' })} ${Object.keys(rawEraRewardPoints)[labels.length - 1]}`
    : '';

  // Use primary color for bars.
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
        beginAtZero: true,
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
            `${new BigNumber(context.parsed.y).decimalPlaces(0).toFormat()} ${t('eraPoints', { ns: 'library' })}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: t('era', { ns: 'library' }),
        data: dataset,
        borderColor: color,
        backgroundColor: color,
        pointRadius: 0,
        borderRadius: 3,
      },
    ],
  };

  return (
    <div>
      <HeadingWrapper>
        <h3>
          {t('recentPerformance', { ns: 'library' })}
          <ButtonHelp
            outline
            marginLeft
            onClick={() => openHelp('Era Points')}
          />
        </h3>
      </HeadingWrapper>

      <GraphWrapper ref={graphInnerRef} style={{ height }}>
        <div
          className="inner"
          style={{
            width,
            height,
          }}
        >
          <Line options={options} data={data} />
        </div>
      </GraphWrapper>
    </div>
  );
};
