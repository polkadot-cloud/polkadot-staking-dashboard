import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { APIContext } from '../../contexts/Api';

ChartJS.register(ArcElement, Tooltip, Legend);

export class BalanceGraph extends React.Component<any, any> {
  static contextType = APIContext;

  // stop component refersh triggered by other API updates
  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (nextState !== this.state);
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
              return `${context.label}: ${context.parsed} ${network.unit}`;
            },
          }
        }
      },
      cutout: '70%',
    };

    const data = {
      labels: ['Free', 'Bonded', 'Reserved', 'Vesting'],
      datasets: [
        {
          label: network.unit,
          data: [12, 19, 3, 5],
          backgroundColor: [
            '#d33079',
            '#eb86b4',
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

export default BalanceGraph;