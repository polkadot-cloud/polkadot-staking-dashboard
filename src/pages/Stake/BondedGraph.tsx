// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { APIContext } from '../../contexts/Api';

ChartJS.register(ArcElement, Tooltip, Legend);

export class BondedGraph extends React.Component<any, any> {
  static contextType = APIContext;

  // stop component refersh triggered by other API updates
  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (this.props !== nextProps);
  }

  render () {

    const { network }: any = this.context;
    
    let { active, unlocking, remaining, total } = this.props;

    let zeroBalance = false;
    if (total === 0 || total === undefined) {
      remaining = -1;
      zeroBalance = true;
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      spacing: zeroBalance ? 0 : 2,
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

    const data = {
      labels: ['Active', 'Unlocking', 'Free'],
      datasets: [
        {
          label: network.unit,
          data: [active, unlocking, remaining],
          backgroundColor: [
            '#d33079',
            '#ccc',
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

export default BondedGraph;