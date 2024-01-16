// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonTertiary, ModalPadding } from '@polkadot-cloud/react';
import { capitalizeFirstLetter } from '@polkadot-cloud/utils';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NetworkList } from 'config/networks';
import { useApi } from 'contexts/Api';
import { Title } from 'library/Modal/Title';
import type { NetworkName } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useUi } from 'contexts/UI';
import { usePrompt } from 'contexts/Prompt';
import BraveIconSVG from '../../img/brave-logo.svg?react';
import {
  BraveWarning,
  ConnectionButton,
  ConnectionsWrapper,
  ContentWrapper,
  NetworkButton,
} from './Wrapper';
import { ProvidersPrompt } from './ProvidersPrompt';

export const Networks = () => {
  const { t } = useTranslation('modals');
  const { isBraveBrowser } = useUi();
  const { openPromptWith } = usePrompt();
  const { network, switchNetwork } = useNetwork();
  const { setModalStatus, setModalResize } = useOverlay().modal;
  const { isLightClient, setIsLightClient, rpcEndpoint } = useApi();
  const networkKey = network;

  // Likely never going to happen; here just to be safe.
  useEffect(() => setModalResize(), [isBraveBrowser]);

  return (
    <>
      <Title title={t('networks')} icon={faGlobe} />
      <ModalPadding>
        <ContentWrapper>
          <h4>{t('selectNetwork')}</h4>
          <div className="items">
            {Object.entries(NetworkList).map(([key, item], index: number) => {
              const Svg = item.brand.inline.svg;
              const rpcDisabled = networkKey === key;

              return (
                <NetworkButton
                  $connected={networkKey === key}
                  disabled={rpcDisabled}
                  key={`network_switch_${index}`}
                  type="button"
                  onClick={() => {
                    if (networkKey !== key) {
                      switchNetwork(key as NetworkName);
                      setModalStatus('closing');
                    }
                  }}
                >
                  <div style={{ width: '1.75rem' }}>
                    <Svg
                      width={item.brand.inline.size}
                      height={item.brand.inline.size}
                    />
                  </div>
                  <h3>{capitalizeFirstLetter(item.name)}</h3>
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
          <h4>{t('connectionType')}</h4>
          <ConnectionsWrapper>
            <div>
              <ConnectionButton
                $connected={!isLightClient}
                disabled={!isLightClient}
                type="button"
                onClick={() => {
                  setIsLightClient(false);
                  switchNetwork(networkKey as NetworkName);
                  setModalStatus('closing');
                }}
              >
                <h3>RPC</h3>
                {!isLightClient && (
                  <h4 className="selected">{t('selected')}</h4>
                )}
              </ConnectionButton>
              <div className="provider">
                <p>{t('provider')}:</p>
                <ButtonTertiary
                  text={rpcEndpoint}
                  onClick={() => openPromptWith(<ProvidersPrompt />)}
                  marginLeft
                />
              </div>
            </div>
            <div>
              <ConnectionButton
                $connected={isLightClient}
                className="off"
                type="button"
                onClick={() => {
                  setIsLightClient(true);
                  switchNetwork(networkKey as NetworkName);
                  setModalStatus('closing');
                }}
              >
                <h3>{t('lightClient')}</h3>
                {isLightClient && <h4 className="selected">{t('selected')}</h4>}
              </ConnectionButton>
            </div>
          </ConnectionsWrapper>

          {isBraveBrowser ? (
            <BraveWarning>
              <BraveIconSVG />
              <div className="brave-text">
                <Trans
                  defaults={t('braveText')}
                  components={{ b: <b />, i: <i /> }}
                />
              </div>
            </BraveWarning>
          ) : null}
        </ContentWrapper>
      </ModalPadding>
    </>
  );
};
