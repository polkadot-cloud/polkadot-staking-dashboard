// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import { useHelp } from 'contexts/Help';
import { useTheme } from 'contexts/Themes';
import LedgerLogoSvg from '@w3ux/extension-assets/Ledger.svg?react';
import type { AnyFunction } from '@w3ux/types';
import { useOverlay } from 'kits/Overlay/Provider';
import { SplashWrapper } from './Wrappers';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ButtonSecondary } from 'kits/Buttons/ButtonSecondary';

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
