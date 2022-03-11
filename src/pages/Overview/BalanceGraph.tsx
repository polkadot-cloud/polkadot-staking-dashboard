// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApi, APIContext } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { planckToDot, fiatAmount, humanNumber } from '../../Utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export const BalanceGraphInner = (props: any) => {

  const { network }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { getAccountBalance }: any = useBalances();
  const balance = getAccountBalance(activeAccount);

  const { prices } = props;

  // get user's total DOT balance
  let freeDot = planckToDot(balance.free);

  // convert balance to fiat value
  let freeBalance = fiatAmount(freeDot * prices.lastPrice);

  let { free, miscFrozen } = balance;

  // convert to DOT unit
  free = planckToDot(free);

  let graphFrozen = planckToDot(miscFrozen);
  let graphFree = free - graphFrozen;

  let zeroBalance = false;
  if (graphFrozen === 0 && graphFree === 0) {
    graphFrozen = -1;
    graphFree = -1;
    zeroBalance = true;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spacing: zeroBalance ? 0 : 5,
    plugins: {
      legend: {
        padding: {
          right: 10,
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
    labels: ['Transferrable', 'Locked'],
    datasets: [
      {
        label: network.unit,
        data: [graphFree, graphFrozen],
        backgroundColor: [
          zeroBalance ? '#ddd' : '#d33079',
          '#eee',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h5>{network.unit} Balance</h5>
      <h1>{freeDot} DOT&nbsp;<span className='fiat'>${humanNumber(freeBalance)}</span></h1>
      <div className='graph' style={{ maxWidth: 400, paddingRight: 10, }}>
        <Doughnut
          options={options}
          data={data}
        />
      </div>
    </>
  );
}

export class BalanceGraph extends React.Component<any, any> {
  static contextType = APIContext;

  state = {
    prices: {
      lastPrice: 0,
      change: 0,
    },
  }

  stateRef: any;
  constructor (props: any) {
    super(props);
    this.stateRef = React.createRef();
    this.stateRef.current = this.state;
  }

  _setState (_state: any) {
    this.stateRef.current = _state;
    this.setState(_state);
  }

  // subscribe to price data
  priceHandle: any;
  initiatePriceInterval = async () => {
    const prices = await this.context.fetchDotPrice();
    this._setState({
      prices: prices
    });

    this.priceHandle = setInterval(async () => {
      const prices = await this.context.fetchDotPrice();
      this._setState({
        prices: prices
      });
    }, 1000 * 60);
  }

  // set up price feed interval
  componentDidMount () {
    this.initiatePriceInterval();
  }
  componentWillUnmount () {
    clearInterval(this.priceHandle);
  }

  shouldComponentUpdate (nextProps: any, nextState: any) {
    return ((nextProps.balances !== this.props.balances) || this.state.prices !== nextState.prices);
  }

  render () {
    return (
      <BalanceGraphInner {...this.props} prices={this.stateRef.current.prices} />
    )
  }
}

export default BalanceGraph;