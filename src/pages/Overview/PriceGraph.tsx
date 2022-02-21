import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import * as faker from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        drawBorder: true,
        color: '#eee',
      },
    },
    y: {
      grid: {
        drawBorder: false,
        color: '#fff',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'DOT Historical Price',
    },
    tooltip: {
      callbacks: {
        title: () => {
          return [];
        },
        label: (context: any) => {
          return '$' + context.parsed.y + ' ' + context.label;
        },
      },
      intersect: false,
      interaction: {
        mode: 'nearest',
      },
      displayColors: false,
      backgroundColor: '#333',
    }
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Price',
      data: labels.map(() => faker.default.datatype.number({ min: -1000, max: 1000 })),
      borderColor: '#d33079',
      backgroundColor: '#d33079',
      pointStyle: undefined,
      pointRadius: 0,
    },
  ],
};
export const PriceGraph = () => {

  return (
    <Line options={options} data={data} />
  );
}

export default PriceGraph;