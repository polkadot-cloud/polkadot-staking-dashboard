import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { useApi } from '../../contexts/Api';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutGraph = (props: any) => {

  const { network }: any = useApi();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawBorder: true,
          color: '#eee',
        },
        ticks: {
          maxTicksLimit: 30,
          autoSkip: true,
        }
      },
      y: {
        grid: {
          drawBorder: false,
          color: 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,255,255,0)',
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
        text: `${network.unit} Accumulated Payouts`,
      },
      tooltip: {
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return `${context.parsed.y} ${context.label}`;
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

  // dummy dates for graph
  let labels = [];
  const start = moment('2022-01-24');
  const end = moment('2022-02-24');

  // If you want an inclusive end date (fully-closed interval)
  for (var m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
    let newDate = m.format('Do MMM');
    labels.push(newDate);
  }

  // dummy payout graph
  let payout = 10.03;

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: labels.map(() => {
          let newPayout = (payout += (0.05 + Math.random() * 0.1)).toFixed(7);
          return newPayout;
        }),
        borderColor: '#d33079',
        backgroundColor: '#d33079',
        pointStyle: undefined,
        pointRadius: 0,
      },
    ],
  };

  return (
    <Line options={options} data={data} />
  );
}

export default PayoutGraph;