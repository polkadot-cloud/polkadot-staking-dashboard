// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import moment from 'moment';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { planckToDot } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { useSubscan } from '../../contexts/Subscan';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutGraphInner = (props: any) => {

  const { network }: any = useApi();
  const { payouts }: any = useSubscan();

  const options_line = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawBorder: false,
          color: 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,255,255,0)',
        },
        ticks: {
          display: false,
          maxTicksLimit: 30,
          autoSkip: true,
        }
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: false,
        },
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
      },
      title: {
        display: false,
        text: `${network.unit} Payouts`,
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

  const data_line = {
    labels: payouts.map((item: any, index: number) => {
      return '';
    }),
    datasets: [
      {
        label: 'Price',
        // data: empty_data,
        data: payouts.map((item: any, index: number) => {
          return planckToDot(item.amount);
        }),
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        },
        backgroundColor: '#d33079',
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2,
      }
    ],
  };

  const data_bar = {
    labels: payouts.map((item: any, index: number) => {
      return moment.unix(item.block_timestamp).format('Do MMM');
    }),
    datasets: [
      {
        label: 'Price',
        // data: empty_data,
        data: payouts.map((item: any, index: number) => {
          return planckToDot(item.amount);
        }),
        borderColor: '#d33079',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        },
        pointRadius: 0,
        borderRadius: 5,
      },
    ],
  };

  const config_bar = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.37,
    scales: {
      x: {
        grid: {
          drawBorder: true,
          color: 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,255,255,0)',
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        }
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#eee',
          borderColor: 'rgba(255,255,255,0)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => {
            return [];
          },
          label: (context: any) => {
            return `${context.parsed.y} ${network.unit}`;
          },
        },
        displayColors: false,
      },
    },
  };

  let lastPayout: any = null;

  if (payouts.length > 0) {
    let _last = payouts.reverse()[0];
    lastPayout = {
      amount: planckToDot(_last['amount']),
      block_timestamp: _last['block_timestamp'] + "",
    };
  }

  let width: number, height: number, gradient: any;
  function getGradient (ctx: any, chartArea: any) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, 'rgba(203, 37, 111, 0.9)');
      gradient.addColorStop(1, 'rgba(223, 81, 144, 0.7)');
    }
    return gradient;
  }

  return (
    <>
      <h1>{lastPayout === null ? 0 : lastPayout.amount} DOT&nbsp;<span className='fiat'>{lastPayout === null ? `` : moment.unix(lastPayout['block_timestamp']).fromNow()}</span>
      </h1>
      <div className='graph' style={{ paddingLeft: '0.8rem', paddingRight: '0.8rem' }}>
        <div style={{ height: '185px' }}>
          <Bar options={config_bar} data={data_bar} />
        </div>
        <div className='graph_line' style={{
          height: '60px', backgroundColor: '#f1f1f1'
        }}>
          <Line options={options_line} data={data_line} />
        </div>
      </div>
    </>
  );
}

export class PayoutGraph extends React.Component<any, any> {

  // stop component refersh triggered by other API updates
  shouldComponentUpdate (nextProps: any, nextState: any) {
    let propsChanged = (nextProps.account !== this.props.account) || (nextProps.payouts !== this.props.payouts);
    return (propsChanged);
  }

  render () {
    return (
      <PayoutGraphInner {...this.props} />
    );
  }
}

export default PayoutGraph;