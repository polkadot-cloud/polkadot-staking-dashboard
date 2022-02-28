import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ACTIVE_ENDPOINT } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
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
          return `${context.label}: ${context.parsed} ${ACTIVE_ENDPOINT.unit}`;
        },
      }
    }
  },
  cutout: '70%',
};

export const data = {
  labels: ['Free', 'Bonded', 'Reserved', 'Vesting'],
  datasets: [
    {
      label: ACTIVE_ENDPOINT.unit,
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

export const BalanceGraph = () => {

  return (
    <Doughnut
      options={options}
      data={data}
    />
  );
}

export default BalanceGraph;