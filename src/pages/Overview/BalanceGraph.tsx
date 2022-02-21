import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    tooltip: {
      displayColors: false,
      backgroundColor: '#333',
      callbacks: {
        label: (context: any) => {
          return context.label + ' DOT: ' + context.parsed;
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
      label: 'DOT',
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