// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NETWORKS } from 'config/networks';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { PaddingWrapper } from '../Wrappers';
import { ContentWrapper } from './Wrapper';

export const Networks = () => {
  const { switchNetwork, network } = useApi();
  const { setStatus } = useModal();

  return (
    <PaddingWrapper>
      <h2>Switch Network</h2>
      <ContentWrapper>
        <div className="items">
          {Object.entries(NETWORKS).map(([key, item]: any, index: number) => {
            const Svg = item.brand.inline.svg;

            return (
              <button
                key={`network_switch_${index}`}
                type="button"
                className="action-button"
                onClick={() => {
                  if (network.name.toLowerCase() !== key) {
                    switchNetwork(key);
                  }
                  setStatus(0);
                }}
              >
                <Svg
                  width={item.brand.inline.size}
                  height={item.brand.inline.size}
                />
                <h3>{item.name}</h3>

                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </button>
            );
          })}
        </div>
      </ContentWrapper>
    </PaddingWrapper>
  );
};

export default Networks;
