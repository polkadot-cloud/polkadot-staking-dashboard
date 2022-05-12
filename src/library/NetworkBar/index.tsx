// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Wrapper, Summary, ConnectionSymbol, NetworkInfo, Separator } from './Wrappers';
import { useApi, APIContext } from '../../contexts/Api';
import { CONNECTION_SYMBOL_COLORS, CONNECTION_STATUS, ENDPOINT_PRICE, NODE_ENDPOINTS } from '../../constants';
import { BlockNumber } from './BlockNumber';
import { ConnectionStatus } from './ConnectionStatus';

export const NetworkBarInner = (props: any) => {

  const { status, switchNetwork, network }: any = useApi();
  const { prices } = props;

  const [open, setOpen] = useState(false);

  // handle connection symbol
  const symbolColor =
    status === CONNECTION_STATUS[1]
      ? CONNECTION_SYMBOL_COLORS['connecting']
      : status === CONNECTION_STATUS[2] ?
        CONNECTION_SYMBOL_COLORS['connected']
        : CONNECTION_SYMBOL_COLORS['disconnected'];

  // handle expand transitions
  const variants = {
    minimised: {
      height: '2.5rem',
    },
    maximised: {
      height: '295px',
    },
  };

  const animate = open ? `maximised` : `minimised`;

  return (
    <Wrapper
      initial={false}
      animate={animate}
      transition={{
        duration: 0.4,
        type: "spring",
        bounce: 0.25
      }}
      variants={variants}
    >
      <Summary>
        <section>
          <network.icon className='network_icon' />
          <p>{network.name}</p>
          <Separator />
          <ConnectionStatus />
        </section>
        <section>
          <button onClick={() => { setOpen(!open) }}>
            {open ? `Collapse Info` : `Network Info`}
          </button>
          <div className='stat' style={{ marginRight: 0 }}>
            {status === CONNECTION_STATUS[2] &&
              <BlockNumber />
            }
            <ConnectionSymbol color={symbolColor} />
          </div>
          <Separator />
          <div className='stat'>
            <span className={`change${prices.change < 0 ? ` neg` : prices.change > 0 ? ` pos` : ``}`}>
              {prices.change < 0 ? `` : prices.change > 0 ? `+` : ``}{prices.change}%
            </span>
          </div>
          <div className='stat'>
            1 {network.api.unit} / {prices.lastPrice} USD
          </div>
        </section>
      </Summary>

      <NetworkInfo>
        <div className='row'>
          <h3>Network</h3>
        </div>
        <div className='row'>
          {Object.entries(NODE_ENDPOINTS).map(([key, item]: any, index: any) => (
            <button
              key={`switch_network_${index}`}
              onClick={() => {
                if (network.name.toLowerCase() !== key) {
                  switchNetwork(key);
                  setOpen(false);
                }
              }}
            >
              <p>{item.name}</p>
            </button>
          ))}
        </div>
        <div className='row'>
          <h3>Endpoints</h3>
        </div>
        <div className='row'>
          <div>
            <p>Node Endpoint:</p>
            <p className='val'>{network.endpoint}</p>
          </div>
          <div>
            <p>Subscan Endpoint:</p>
            <p className='val'>{network.subscanEndpoint}</p>
          </div>
          <div>
            <p>Price Tracker:</p>
            <p className='val'>{ENDPOINT_PRICE}</p>
          </div>
        </div>
      </NetworkInfo>
    </Wrapper>
  )
}

export class NetworkBar extends React.Component<any, any> {
  static contextType = APIContext;

  state: any = {
    prices: {
      lastPrice: 0,
      change: 0,
    },
    network: null,
  }

  stateRef: any;
  constructor (props: any) {
    super(props);
    this.stateRef = React.createRef();
    this.stateRef.current = this.state;
  }

  _setState (_state: any) {
    this.stateRef.current = _state;
    this.setState({
      ..._state,
    });
  }

  // subscribe to price data
  priceHandle: any;

  initiatePriceInterval = async () => {
    const prices = await this.context.fetchDotPrice();
    this._setState({
      prices: prices
    });
    this.setPriceInterval();
  }

  setPriceInterval = async () => {
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

  componentDidUpdate () {
    clearInterval(this.priceHandle);
    this.setPriceInterval();

    this._setState({
      ...this.state,
      network: this.context?.network?.name ?? null
    })
  }

  shouldComponentUpdate (nextProps: any, nextState: any) {
    let update = false;
    if (this.state.prices !== nextState.prices) {
      update = true;
    }
    let network = this.context?.network?.name ?? null;
    if (network !== this.state.network) {
      update = true;
    }
    return (update);
  }

  render () {
    return (
      <NetworkBarInner {...this.props} prices={this.stateRef.current.prices} />
    )
  }
}

export default NetworkBar;