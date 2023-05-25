// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QrScanSignature } from '@polkadot/react-qr';
import { ButtonPrimary, ButtonSecondary } from '@polkadotcloud/core-ui';
import { clipAddress, isValidAddress } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useVaultHardware } from 'contexts/Hardware/Vault';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import { QRVieweraWrapper } from 'library/Import/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Reader = () => {
  const { t } = useTranslation('modals');
  const { addToAccounts, formatAccountSs58 } = useConnect();
  const { setStatus: setOverlayStatus } = useOverlay();
  const { addVaultAccount, vaultAccountExists, vaultAccounts } =
    useVaultHardware();

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<any>(undefined);

  // Store QR data feedback.
  const [feedback, setFeedback] = useState<string>('');

  const handleQrData = (signature: string) => {
    setQrData(signature.split(':')?.[1] || '');
  };

  // Reset QR data on open.
  useEffect(() => {
    setQrData(undefined);
  }, []);

  useEffect(() => {
    setFeedback(
      qrData === undefined
        ? `${t('waitingForQRCode')}`
        : isValidAddress(qrData)
        ? formatAccountSs58(qrData)
          ? `${t('differentNetworkAddress')}`
          : vaultAccountExists(qrData)
          ? `${t('accountAlreadyImported')}`
          : `${t('addressReceived')}`
        : `${t('invalidAddress')}`
    );
  }, [qrData]);

  const valid =
    isValidAddress(qrData) &&
    !vaultAccountExists(qrData) &&
    !formatAccountSs58(qrData);

  return (
    <QRVieweraWrapper>
      <h3 className="title">{t('scanFromPolkadotVault')}</h3>
      <div className="viewer">
        <QrScanSignature
          size={279}
          onScan={({ signature }) => {
            handleQrData(signature);
          }}
        />
      </div>
      <div className="foot">
        <h3>{feedback}</h3>
        <h3 className="address">
          {isValidAddress(qrData) && !formatAccountSs58(qrData) ? (
            <>
              <Identicon value={qrData} size={22} />
              {clipAddress(qrData)}
            </>
          ) : (
            '...'
          )}
        </h3>
        <div>
          <ButtonPrimary
            lg
            marginRight
            text={t('importAddress')}
            disabled={!valid}
            onClick={() => {
              const account = addVaultAccount(qrData, vaultAccounts.length);
              if (account) {
                addToAccounts([account]);
              }
              setOverlayStatus(0);
            }}
          />
          <ButtonSecondary
            lg
            text={t('cancel')}
            onClick={() => setOverlayStatus(0)}
          />
        </div>
      </div>
    </QRVieweraWrapper>
  );
};
