// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NETWORKS } from 'config/networks';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { NetworkName } from 'types';
import { PaddingWrapper } from '../Wrappers';
import {
  ContentWrapper,
  NetworkButton,
  ConnectionsWrapper,
  BraveWarning,
  ConnectionButton,
} from './Wrapper';
import { ReactComponent as BraveIconSVG } from '../../img/brave-logo.svg';

export const Networks = () => {
  const [braveBrowser, setBraveBrowser] = useState<boolean>(false);
  const { switchNetwork, network, isLightClient } = useApi();
  const { setStatus } = useModal();
  const networkKey: string = network.name.toLowerCase();

  useEffect(() => {
    // @ts-ignore
    window.navigator?.brave?.isBrave().then(async (isBrave: any) => {
      setBraveBrowser(isBrave);
    });
  });

  return (
    <PaddingWrapper>
      <h2>Switch Network</h2>
      <ContentWrapper>
        <h4>Select Network</h4>
        <div className="items">
          {Object.entries(NETWORKS).map(([key, item]: any, index: number) => {
            const Svg = item.brand.inline.svg;
            const rpcDisabled = networkKey === key && !isLightClient;

            return (
              <NetworkButton
                connected={networkKey === key}
                disabled={rpcDisabled}
                key={`network_switch_${index}`}
                type="button"
                className="action-button"
                onClick={() => {
                  if (
                    networkKey !== key ||
                    (networkKey === key && isLightClient)
                  ) {
                    switchNetwork(key, false);
                    setStatus(0);
                  }
                }}
              >
                <div style={{ width: '1.75rem' }}>
                  <Svg
                    width={item.brand.inline.size}
                    height={item.brand.inline.size}
                  />
                </div>
                <h3>{item.name}</h3>
                {networkKey === key && <h4 className="connected">Connected</h4>}
                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </NetworkButton>
            );
          })}
        </div>
        <h4>Connection Type</h4>
        <ConnectionsWrapper>
          <ConnectionButton
            connected={!isLightClient}
            disabled={!isLightClient}
            type="button"
            onClick={() => {
              switchNetwork(networkKey as NetworkName, false);
              setStatus(0);
            }}
          >
            <h3>RPC</h3>
            {!isLightClient && <h4 className="connected">Selected</h4>}
          </ConnectionButton>
          <ConnectionButton
            connected={isLightClient}
            disabled={isLightClient}
            type="button"
            onClick={() => {
              switchNetwork(networkKey as NetworkName, true);
              setStatus(0);
            }}
          >
            <h3>Light Client</h3>
            {isLightClient && <h4 className="connected">Selected</h4>}
          </ConnectionButton>
        </ConnectionsWrapper>

        {braveBrowser ? (
          <BraveWarning>
            <BraveIconSVG />
            <div className="brave-text">
              <b>To Brave users!</b> Due to a recent update (
              <i>Brave version 1.36</i>), there may appear issues while using
              light clients (e.g. not connected).{' '}
              <a
                href="https://paritytech.github.io/substrate-connect/#troubleshooting"
                target="_blank"
                rel="noreferrer"
                className="learn-more"
              >
                Learn more here.
              </a>
            </div>
          </BraveWarning>
        ) : null}
      </ContentWrapper>
    </PaddingWrapper>
  );
};

export default Networks;
