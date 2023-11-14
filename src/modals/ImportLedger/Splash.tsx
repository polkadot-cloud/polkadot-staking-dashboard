// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonSecondary } from '@polkadot-cloud/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/Hardware/Ledger/LedgerHardware';
import { useHelp } from 'contexts/Help';
import { useTheme } from 'contexts/Themes';
import LedgerLogoSvg from '@polkadot-cloud/assets/extensions/svg/ledger.svg?react';
import type { AnyFunction } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { SplashWrapper } from './Wrappers';

export const Splash = ({ onGetAddress }: AnyFunction) => {
  const { t } = useTranslation('modals');
  const { getStatusCode, getIsExecuting, getFeedback } = useLedgerHardware();
  const { mode } = useTheme();
  const { openHelp } = useHelp();
  const { replaceModal, setModalResize } = useOverlay().modal;

  const statusCode = getStatusCode();

  const initFetchAddress = async () => {
    await onGetAddress();
  };

  const fallbackMessage = t('checking');
  const feedback = getFeedback();
  const helpKey = feedback?.helpKey;

  // Automatically fetch first address.
  useEffect(() => {
    initFetchAddress();
  }, []);

  // Resize modal on new message.
  useEffect(() => setModalResize(), [statusCode, feedback]);

  return (
    <>
      <div style={{ display: 'flex', padding: '1rem' }}>
        <h1>
          <ButtonSecondary
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={async () =>
              replaceModal({ key: 'Connect', options: { disableScroll: true } })
            }
          />
        </h1>
      </div>
      <SplashWrapper>
        <div className="icon">
          <LedgerLogoSvg
            style={{ transform: 'scale(0.6)' }}
            opacity={mode === 'dark' ? 0.5 : 0.1}
          />
        </div>

        <div className="content">
          <h2>
            {feedback?.message || fallbackMessage}
            {helpKey ? (
              <ButtonHelp
                marginLeft
                onClick={() => openHelp(helpKey)}
                background="secondary"
              />
            ) : null}
          </h2>

          {!getIsExecuting() ? (
            <>
              <h5>{t('ensureLedgerIsConnected')}</h5>
              <div className="button">
                <ButtonSecondary
                  text={
                    statusCode?.statusCode === 'DeviceNotConnected'
                      ? t('continue')
                      : t('tryAgain')
                  }
                  onClick={async () => initFetchAddress()}
                />
              </div>
            </>
          ) : null}
        </div>
      </SplashWrapper>
    </>
  );
};
