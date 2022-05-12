// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useRef } from 'react';
import { Wrapper, Summary, ConnectionSymbol, NetworkInfo, Separator } from './Wrappers';
import { useApi } from '../../contexts/Api';
import { useUi } from '../../contexts/UI';
import { BlockNumber } from './BlockNumber';
import { ConnectionStatus } from './ConnectionStatus';
import { usePrices } from '../../library/Hooks/usePrices';
import { useOutsideAlerter } from '../../library/Hooks';
import {
  CONNECTION_SYMBOL_COLORS,
  CONNECTION_STATUS,
  NODE_ENDPOINTS
} from '../../constants';

export const NetworkBar = () => {

  const { services } = useUi();
  const { status, switchNetwork, network }: any = useApi();
  const prices = usePrices();

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
      height: '150px',
    },
  };

  const animate = open ? `maximised` : `minimised`;

  const ref = useRef(null);

  useOutsideAlerter(ref, () => {
    setOpen(false);
  }, ['igignore-network-info-toggle']);

  return (
    <Wrapper
      ref={ref}
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
          <button
            className='ignore-network-info-toggle'
            onClick={() => { setOpen(!open) }}
          >
            {open ? `Collapse` : `Network`}
          </button>
          <div className='stat' style={{ marginRight: 0 }}>
            {status === CONNECTION_STATUS[2] &&
              <BlockNumber />
            }
            <ConnectionSymbol color={symbolColor} />
          </div>
          {services.includes('binance_spot') &&
            <>
              <Separator />
              <div className='stat'>
                <span className={`change${prices.change < 0 ? ` neg` : prices.change > 0 ? ` pos` : ``}`}>
                  {prices.change < 0 ? `` : prices.change > 0 ? `+` : ``}{prices.change}%
                </span>
              </div>
              <div className='stat'>
                1 {network.api.unit} / {prices.lastPrice} USD
              </div>
            </>
          }
        </section>
      </Summary>

      <NetworkInfo>
        <div className='row'>
          <h3> Choose Network:</h3>
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
      </NetworkInfo>
    </Wrapper>
  )
}

export default NetworkBar;