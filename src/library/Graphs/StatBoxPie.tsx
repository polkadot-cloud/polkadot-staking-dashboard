// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { Pie } from 'react-chartjs-2';
import { graphColors } from 'styles/graphs';
import type { StatPieProps } from './types';

ChartJS.register(ArcElement, Tooltip);

export const StatPie = ({ value, value2 }: StatPieProps) => {
  const { colors } = useApi().network;
  const { mode } = useTheme();

  const isZero = !value && !value;
  if (isZero) {
    value = 1;
    value2 = 0;
  }
  const borderColor = isZero
    ? graphColors.inactive[mode]
    : [colors.primary[mode], graphColors.border[mode]];

  const backgroundColor = isZero
    ? graphColors.inactive[mode]
    : colors.primary[mode];

  const options = {
    borderColor,
    backgroundColor,
    hoverBackgroundColor: [backgroundColor, graphColors.inactive[mode]],
    responsive: true,
    maintainAspectRatio: false,
    spacing: 0,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const data = {
    datasets: [
      {
        data: [value, value2],
        backgroundColor: [backgroundColor, graphColors.inactive[mode]],
        borderWidth: 0.5,
      },
    ],
  };

  return (
    <div className="graph" style={{ width: 36, height: 36 }}>
      <Pie options={options} data={data} />
    </div>
  );
};
