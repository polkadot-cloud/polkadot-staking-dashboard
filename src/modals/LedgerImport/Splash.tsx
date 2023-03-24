// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useModal } from 'contexts/Modal';
import { ReactComponent as CrossSVG } from 'img/cross.svg';
import { ReactComponent as LogoSVG } from 'img/ledgerLogo.svg';
import { Title } from 'library/Modal/Title';
import { CustomHeaderWrapper } from 'modals/Wrappers';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyFunction } from 'types';
import { determineStatusFromCodes } from './Utils';
import { SplashWrapper } from './Wrappers';

export const Splash = ({ handleLedgerLoop }: AnyFunction) => {
  const { t } = useTranslation('modals');
  const { replaceModalWith, setStatus } = useModal();
  const {
    getStatusCodes,
    isPaired,
    getIsExecuting,
    setIsExecuting,
    pairDevice,
    getDefaultMessage,
  } = useLedgerHardware();
  const statusCodes = getStatusCodes();

  // Initialise listeners for Ledger IO.
  useEffect(() => {
    if (isPaired !== 'paired') {
      pairDevice();
    }
  }, []);

  const initFetchAddress = async () => {
    const paired = await pairDevice();
    if (paired) {
      setIsExecuting(true);
      handleLedgerLoop();
    }
  };

  // Once the device is paired, start `handleLedgerLoop`.
  useEffect(() => {
    initFetchAddress();
  }, [isPaired]);

  const { title, statusCode } = determineStatusFromCodes(statusCodes, false);
  const fallbackMessage = t('checking');
  const defaultMessage = getDefaultMessage();

  return (
    <>
      <CustomHeaderWrapper>
        <h1>
          <ButtonSecondary
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={async () => replaceModalWith('Connect', {}, 'large')}
          />
        </h1>
        <button
          type="button"
          onClick={() => setStatus(2)}
          className="closeModal"
        >
          <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </CustomHeaderWrapper>
      <Title title="" />
      <SplashWrapper>
        <div className="icon">
          <LogoSVG style={{ transform: 'scale(0.6)' }} opacity={0.05} />
        </div>

        <div className="content">
          <h2>
            {defaultMessage ||
              (!getIsExecuting() || !statusCodes.length
                ? fallbackMessage
                : statusCode === 'TransactionRejected'
                ? fallbackMessage
                : title)}
          </h2>
          {!getIsExecuting() ? (
            <>
              <h5>{t('ensureLedgerIsConnected')}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ButtonSecondary
                  text={
                    statusCode === 'DeviceNotConnected'
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
