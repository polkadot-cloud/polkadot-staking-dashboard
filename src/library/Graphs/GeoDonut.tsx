// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { graphColors } from 'styles/graphs';
import chroma from 'chroma-js';
import { ellipsisFn } from '@polkadot-cloud/utils';
import type { GeoDonutProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GeoDonut = ({
  title,
  series = { labels: [], data: [] },
  height = 'auto',
  width = 'auto',
}: GeoDonutProps) => {
  const { colors } = useApi().network;
  const { mode } = useTheme();
  const { labels } = series;
  let { data } = series;
  const isZero = data.length === 0;
  const backgroundColor = isZero
    ? graphColors.inactive[mode]
    : colors.primary[mode];

  const total = data.reduce((acc: number, value: number) => acc + value, 0);
  const labelTotal = labels.reduce(
    (acc: number, label: string) => acc + label.length,
    0
  );
  data = data.map((value: number) => (value / total) * 100);

  const options = {
    borderColor: graphColors.inactive[mode],
    hoverBorderColor: graphColors.inactive[mode],
    backgroundColor,
    hoverBackgroundColor: [backgroundColor, graphColors.inactive[mode]],
    responsive: true,
    maintainAspectRatio: false,
    spacing: 0,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        maxHeight: 25,
        labels: {
          boxWidth: 10,
          generateLabels: (chart: any) => {
            const ls =
              ChartJS.overrides.doughnut.plugins.legend.labels.generateLabels(
                chart
              );
            return ls.map((l) => {
              l.text = ellipsize(l.text, labelTotal);
              return l;
            });
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => ` ${title}: ${context.raw.toFixed(1)} %`,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        // We make a gradient of N+2 colors from active to inactive, and we discard both ends
        // N is the number of datapoints to plot
        backgroundColor: chroma
          .scale([backgroundColor, graphColors.inactive[mode]])
          .colors(data.length + 1),
        borderWidth: 0.5,
      },
    ],
  };

  return (
    <div style={{ width, height }}>
      <Doughnut options={options} data={chartData} />
    </div>
  );
};

/**
 * Depending on how much text we need to display in the legend it may be needed to cut the labels more or less.
 * This function reuses polkadot ellipsize function to achieve that purpose when required.
 * @param str the string to adjust
 * @param labelTotal
 */
const ellipsize = (str: string, labelTotal: number) => {
  // The maximum we can afford to present
  const maxLength = labelTotal > 30 ? 10 : 20;

  // We may not need to ellipsize in some cases
  if (str.length <= maxLength) return str;

  // Note that this function will add 3 characters '...'
  return ellipsisFn(str, maxLength - 3, 'end');
};
