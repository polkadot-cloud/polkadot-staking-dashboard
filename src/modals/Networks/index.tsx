// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, Fragment, useEffect } from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NETWORKS } from 'config/networks';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { PaddingWrapper } from '../Wrappers';
import { ContentWrapper } from './Wrapper';
import { ReactComponent as BraveIconSVG } from '../../img/brave-logo.svg';

export const Networks = () => {
  const [braveBrowser, setBraveBrowser] = useState<boolean>(false);
  const { switchNetwork, network, isLightClient } = useApi();
  const { setStatus } = useModal();

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
        <div className="items">
          {Object.entries(NETWORKS).map(([key, item]: any, index: number) => {
            const Svg = item.brand.inline.svg;

            const disabledNetworkButton =
              network.name.toLowerCase() === key && !isLightClient;
            const disabledLCButton =
              network.name.toLowerCase() === key && isLightClient;

            return (
              <Fragment key={`network_${index}`}>
                <button
                  disabled={disabledNetworkButton}
                  key={`network_switch_${index}`}
                  type="button"
                  className={`action-button 
                  ${
                    item.endpoints.lightClient
                      ? 'w-light-client'
                      : 'wo-light-client'
                  } ${disabledLCButton ? ' disabled' : ''}`}
                  onClick={() => {
                    if (
                      network.name.toLowerCase() !== key ||
                      (network.name.toLowerCase() === key && isLightClient)
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

                  <div>
                    <FontAwesomeIcon
                      transform="shrink-2"
                      icon={faChevronRight}
                    />
                  </div>
                </button>
                {/* Light Client button */}
                {item.endpoints.lightClient ? (
                  <button
                    disabled={disabledLCButton}
                    type="button"
                    className={`action-button light-client ${
                      disabledLCButton ? 'disabled' : ''
                    }`}
                    key={`switch_network_${index}_lc`}
                    onClick={() => {
                      if (
                        network.name.toLowerCase() !== key ||
                        (network.name.toLowerCase() === key && !isLightClient)
                      ) {
                        switchNetwork(key, true);
                        setStatus(0);
                      }
                    }}
                  >
                    <h3>Light Client</h3>
                    <div>
                      <FontAwesomeIcon
                        transform="shrink-2"
                        icon={faChevronRight}
                      />
                    </div>
                  </button>
                ) : null}
                {Object.entries(NETWORKS).length - 1 !== index && <span />}
              </Fragment>
            );
          })}
        </div>
        {braveBrowser ? (
          <div className="brave-note">
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
          </div>
        ) : null}
      </ContentWrapper>
    </PaddingWrapper>
  );
};

export default Networks;
