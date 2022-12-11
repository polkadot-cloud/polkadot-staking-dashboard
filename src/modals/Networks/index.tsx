// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NETWORKS } from 'config/networks';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { Title } from 'library/Modal/Title';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkName } from 'types';
import { ReactComponent as BraveIconSVG } from '../../img/brave-logo.svg';
import { PaddingWrapper } from '../Wrappers';
import {
  BraveWarning,
  ConnectionButton,
  ConnectionsWrapper,
  ContentWrapper,
  NetworkButton,
} from './Wrapper';

export const Networks = () => {
  const [braveBrowser, setBraveBrowser] = useState<boolean>(false);
  const { switchNetwork, network, isLightClient } = useApi();
  const { setStatus } = useModal();
  const networkKey: string = network.name.toLowerCase();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();
  const { t } = useTranslation('modals');

  useEffect(() => {
    // @ts-ignore
    window.navigator?.brave?.isBrave().then(async (isBrave: boolean) => {
      setBraveBrowser(isBrave);
    });
  });

  const posRef = useRef(null);

  const tooltipText = t('undergoing_maintenance');

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <>
      <Title title={t('networks')} icon={faGlobe} />
      <PaddingWrapper>
        <ContentWrapper>
          <h4>{t('select_network')}</h4>
          <div className="items">
            {Object.entries(NETWORKS).map(([key, item]: any, index: number) => {
              const Svg = item.brand.inline.svg;
              const rpcDisabled = networkKey === key;

              return (
                <NetworkButton
                  connected={networkKey === key}
                  disabled={rpcDisabled}
                  key={`network_switch_${index}`}
                  type="button"
                  className="action-button"
                  onClick={() => {
                    if (networkKey !== key) {
                      switchNetwork(key, isLightClient);
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
                  {networkKey === key && (
                    <h4 className="selected">{t('selected')}</h4>
                  )}
                  <div>
                    <FontAwesomeIcon
                      transform="shrink-2"
                      icon={faChevronRight}
                    />
                  </div>
                </NetworkButton>
              );
            })}
          </div>
          <h4>{t('connection_type')}</h4>
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
              {!isLightClient && <h4 className="selected">{t('selected')}</h4>}
            </ConnectionButton>
            <ConnectionButton
              connected={isLightClient}
              className="off"
              disabled
              type="button"
              onClick={() => {
                switchNetwork(networkKey as NetworkName, true);
                setStatus(0);
              }}
            >
              <TooltipTrigger
                className="tooltip-trigger-element"
                data-tooltip-text={tooltipText}
                onMouseMove={() => toggleTooltip()}
              />
              <TooltipPosition ref={posRef} style={{ left: '10px' }} />
              <h3>{t('light_client')}</h3>
              {isLightClient && <h4 className="selected">{t('selected')}</h4>}
            </ConnectionButton>
          </ConnectionsWrapper>

          {braveBrowser ? (
            <BraveWarning>
              <BraveIconSVG />
              <div className="brave-text">
                {t('brave_text')}{' '}
                <a
                  href="https://paritytech.github.io/substrate-connect/#troubleshooting"
                  target="_blank"
                  rel="noreferrer"
                  className="learn-more"
                >
                  {t('learn_more_here')}
                </a>
              </div>
            </BraveWarning>
          ) : null}
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};

export default Networks;
