// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { Pie } from 'react-chartjs-2';
import {
  defaultThemes,
  networkColors,
  networkColorsTransparent,
} from 'theme/default';
import { StatPieProps } from './types';

ChartJS.register(ArcElement, Tooltip);

export const StatPie = ({ value, value2 }: StatPieProps) => {
  // format zero value graph
  const isZero = !value && !value;
  if (isZero) {
    value = 1;
    value2 = 0;
  }

  const { name } = useApi().network;
  const { mode } = useTheme();

  const borderColor = isZero
    ? defaultThemes.buttons.toggle.background[mode]
    : [networkColors[`${name}-${mode}`], defaultThemes.transparent[mode]];

  const backgroundColor = isZero
    ? defaultThemes.buttons.toggle.background[mode]
    : networkColorsTransparent[`${name}-${mode}`];

  const options = {
    borderColor,
    hoverBorderColor: borderColor,
    backgroundColor,
    hoverBackgroundColor: [
      networkColorsTransparent[`${name}-${mode}`],
      defaultThemes.transparent[mode],
    ],
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
        backgroundColor: [
          networkColorsTransparent[`${name}-${mode}`],
          defaultThemes.transparent[mode],
        ],
        borderWidth: 1.75,
      },
    ],
  };

  return (
    <div className="graph" style={{ width: 36, height: 36 }}>
      <Pie options={options} data={data} />
    </div>
  );
};

export default StatPie;
