// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@polkadot-cloud/utils';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { usePlugins } from 'contexts/Plugins';
import { usePrices } from 'library/Hooks/usePrices';
import { useNetwork } from 'contexts/Network';
import { Status } from './Status';
import { Summary, Wrapper } from './Wrappers';
import { isCustomEvent } from 'static/utils';
import { useEventListener } from 'usehooks-ts';
import { Odometer, useEffectIgnoreInitial } from '@polkadot-cloud/react';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHive } from '@fortawesome/free-brands-svg-icons';

export const NetworkBar = () => {
  const { t } = useTranslation('library');
  const { plugins } = usePlugins();
  const { isLightClient } = useApi();
  const { networkData, network } = useNetwork();
  const prices = usePrices();

  const PRIVACY_URL = import.meta.env.VITE_PRIVACY_URL;
  const DISCLAIMER_URL = import.meta.env.VITE_DISCLAIMER_URL;
  const ORGANISATION = import.meta.env.VITE_ORGANISATION;
  const LEGAL_DISCLOSURES_URL = import.meta.env.VITE_LEGAL_DISCLOSURES_URL;

  // Store incoming block number.
  const [blockNumber, setBlockNumber] = useState<string>();

  const newBlockCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      setBlockNumber(e.detail.blockNumber);
    }
  };

  const ref = useRef<Document>(document);
  useEventListener('new-block-number', newBlockCallback, ref);

  // Reset block number on network change.
  useEffectIgnoreInitial(() => {
    setBlockNumber('0');
  }, [network]);

  return (
    <Wrapper>
      <networkData.brand.icon className="network_icon" />
      <Summary>
        <section>
          <p>
            {ORGANISATION === undefined
              ? `${capitalizeFirstLetter(network)}${
                  isLightClient ? ` Light` : ``
                }`
              : ORGANISATION}
          </p>
          {PRIVACY_URL !== undefined ? (
            <p>
              <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
                {t('privacy')}
              </a>
            </p>
          ) : (
            <Status />
          )}
          {DISCLAIMER_URL !== undefined && (
            <p>
              <a href={DISCLAIMER_URL} target="_blank" rel="noreferrer">
                {t('disclaimer')}
              </a>
            </p>
          )}
          {LEGAL_DISCLOSURES_URL !== undefined && (
            <p>
              <a href={LEGAL_DISCLOSURES_URL} target="_blank" rel="noreferrer">
                {t('legalDisclosures')}
              </a>
            </p>
          )}
        </section>
        <section>
          <div className="hide-small">
            {plugins.includes('binance_spot') && (
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
                  1 {networkData.api.unit} / {prices.lastPrice} USD
                </div>
              </>
            )}

            <div className="stat last">
              <FontAwesomeIcon icon={faHive} />
              <Odometer
                wholeColor="var(--text-color-secondary)"
                value={new BigNumber(blockNumber || '0').toFormat()}
                spaceBefore={'0.35rem'}
              />
            </div>
          </div>
        </section>
      </Summary>
    </Wrapper>
  );
};
