// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSecondary } from '@polkadot-cloud/react';
import { isValidAddress } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useVaultHardware } from 'contexts/Hardware/Vault';
import { usePrompt } from 'contexts/Prompt';
import { QRViewerWrapper } from 'library/Import/Wrappers';
import { QrScanSignature } from 'library/QRCode/ScanSignature';

export const Reader = () => {
  const { t } = useTranslation('modals');
  const { addOtherAccounts, formatAccountSs58 } = useConnect();
  const { setStatus: setPromptStatus } = usePrompt();
  const { addVaultAccount, vaultAccountExists, vaultAccounts } =
    useVaultHardware();

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<any>(undefined);

  // Store QR data feedback.
  const [feedback, setFeedback] = useState<string>('');

  const handleQrData = (signature: string) => {
    setQrData(signature.split(':')?.[1] || '');
  };

  const valid =
    isValidAddress(qrData) &&
    !vaultAccountExists(qrData) &&
    !formatAccountSs58(qrData);

  // Reset QR data on open.
  useEffect(() => {
    setQrData(undefined);
  }, []);

  useEffect(() => {
    // Add account and close overlay if valid.
    if (valid) {
      const account = addVaultAccount(qrData, vaultAccounts.length);
      if (account) {
        addOtherAccounts([account]);
      }
      setPromptStatus(0);
    }

    // Display feedback.
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

  return (
    <QRViewerWrapper>
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
        <div>
          <ButtonSecondary
            lg
            text={t('cancel')}
            onClick={() => setPromptStatus(0)}
          />
        </div>
      </div>
    </QRViewerWrapper>
  );
};
