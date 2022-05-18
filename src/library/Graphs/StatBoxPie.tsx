// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { defaultThemes } from '../../theme/default';
import { useTheme } from '../../contexts/Themes';

ChartJS.register(ArcElement, Tooltip);

export const StatPie = (props: any) => {
  let { value, value2 } = props;

  // format zero value graph
  const isZero = !value && !value;
  if (isZero) {
    value = 1;
    value2 = 0;
  }

  const { mode } = useTheme();

  const borderColor: any = isZero
    ? defaultThemes.buttons.toggle.background[mode]
    : [
      defaultThemes.text.secondary[mode],
      defaultThemes.transparent[mode],
    ];

  const backgroundColor: any = isZero
    ? defaultThemes.buttons.toggle.background[mode]
    : defaultThemes.transparent[mode];

  const options = {
    borderColor,
    hoverBorderColor: borderColor,
    backgroundColor,
    hoverBackgroundColor: backgroundColor,
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
        backgroundColor,
        borderWidth: 1.25,
      },
    ],
  };

  return (
    <div className="graph" style={{ width: 36, height: 36 }}>
      <Pie
        options={options}
        data={data}
      />
    </div>
  );
};

export default StatPie;
