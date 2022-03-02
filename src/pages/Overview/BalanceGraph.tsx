// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { APIContext } from '../../contexts/Api';

ChartJS.register(ArcElement, Tooltip, Legend);

export class BalanceGraph extends React.Component<any, any> {
  static contextType = APIContext;

  // stop component refersh triggered by other API updates
  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (nextProps.balances !== this.props.balances);
  }

  render () {

    const { network }: any = this.context;

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          padding: {
            right: 20,
          },
          display: true,
          position: 'left' as const,
          align: 'center' as const,
          labels: {
            padding: 20,
            font: {
              size: 15,
              color: '#333',
              weight: '500',
            },
          },
        },
        tooltip: {
          displayColors: false,
          backgroundColor: '#333',
          callbacks: {
            label: (context: any) => {
              return `${context.label}: ${context.parsed === -1 ? 0 : context.parsed} ${network.unit}`;
            },
          }
        }
      },
      cutout: '70%',
    };

    const { balances } = this.props;
    let { free, miscFrozen } = balances;

    // convert to DOT unit
    free = free / (10 ** 10);

    let graphFrozen = (miscFrozen) / (10 ** 10);
    let graphFree = free - graphFrozen;

    if (graphFrozen === 0) graphFrozen = -1;
    if (graphFree === 0) graphFree = -1;

    const data = {
      labels: ['Free', 'Locked'],
      datasets: [
        {
          label: network.unit,
          data: [graphFree, graphFrozen],
          backgroundColor: [
            '#d33079',
            '#eee',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Doughnut
        options={options}
        data={data}
      />
    );
  }
}

export default BalanceGraph;