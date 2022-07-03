// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useRef } from 'react';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { usePrices } from 'library/Hooks/usePrices';
import { CONNECTION_SYMBOL_COLORS, NODE_ENDPOINTS } from 'consts';
import { ConnectionStatus } from 'types/api';
import { useOutsideAlerter } from 'library/Hooks';
import {
  Wrapper,
  Summary,
  ConnectionSymbol,
  NetworkInfo,
  Separator,
} from './Wrappers';
import { BlockNumber } from './BlockNumber';
import { Status } from './Status';

export const NetworkBar = () => {
  const { services } = useUi();
  const { status, switchNetwork, network } = useApi();
  const prices = usePrices();

  const [open, setOpen] = useState(false);

  // handle connection symbol
  const symbolColor =
    status === ConnectionStatus.Connecting
      ? CONNECTION_SYMBOL_COLORS.connecting
      : status === ConnectionStatus.Connected
      ? CONNECTION_SYMBOL_COLORS.connected
      : CONNECTION_SYMBOL_COLORS.disconnected;

  // handle expand transitions
  const variants = {
    minimised: {
      height: '2.5rem',
    },
    maximised: {
      height: '155px',
    },
  };

  const animate = open ? 'maximised' : 'minimised';
  const ref = useRef(null);

  const PRIVACY_URL = process.env.REACT_APP_PRIVACY_URL;
  const ORGANISATION = process.env.REACT_APP_ORGANISATION;

  useOutsideAlerter(
    ref,
    () => {
      setOpen(false);
    },
    ['igignore-network-info-toggle']
  );

  return (
    <Wrapper
      ref={ref}
      initial={false}
      animate={animate}
      transition={{
        duration: 0.4,
        type: 'spring',
        bounce: 0.25,
      }}
      variants={variants}
    >
      <Summary>
        <section>
          <network.icon className="network_icon" />
          <p>{ORGANISATION === undefined ? network.name : ORGANISATION}</p>
          <Separator />
          {PRIVACY_URL !== undefined ? (
            <p>
              <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
                Privacy
              </a>
            </p>
          ) : (
            <Status />
          )}
        </section>
        <section>
          <button
            type="button"
            className="ignore-network-info-toggle"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? 'Collapse' : 'Switch Network'}
          </button>
          <div className="stat" style={{ marginRight: 0 }}>
            {status === ConnectionStatus.Connected && <BlockNumber />}
            <ConnectionSymbol color={symbolColor} />
          </div>
          <div className="hide-small">
            {services.includes('binance_spot') && (
              <>
                <div className="stat">
                  <span
                    className={`change${
                      prices.change < 0
                        ? ' neg'
                        : prices.change > 0
                        ? ' pos'
                        : ''
                    }`}
                  >
                    {prices.change < 0 ? '' : prices.change > 0 ? '+' : ''}
                    {prices.change}%
                  </span>
                </div>
                <div className="stat">
                  1 {network.api.unit} / {prices.lastPrice} USD
                </div>
                <Separator />
              </>
            )}
          </div>
        </section>
      </Summary>

      <NetworkInfo>
        <div className="row">
          <h2>Switch Network</h2>
        </div>
        <div className="row">
          {Object.entries(NODE_ENDPOINTS).map(
            ([key, item]: any, index: number) => (
              <button
                type="button"
                key={`switch_network_${index}`}
                onClick={() => {
                  if (network.name.toLowerCase() !== key) {
                    switchNetwork(key);
                    setOpen(false);
                  }
                }}
              >
                <h3>{item.name}</h3>
              </button>
            )
          )}
        </div>
      </NetworkInfo>
    </Wrapper>
  );
};

export default NetworkBar;
