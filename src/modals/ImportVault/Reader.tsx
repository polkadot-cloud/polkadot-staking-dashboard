// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSecondary } from '@polkadot-cloud/react';
import { isValidAddress } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVaultAccounts } from 'contexts/Hardware/Vault/VaultAccounts';
import { usePrompt } from 'contexts/Prompt';
import { QRViewerWrapper } from 'library/Import/Wrappers';
import { QrScanSignature } from 'library/QRCode/ScanSignature';
import { useNetwork } from 'contexts/Network';
import { formatAccountSs58 } from 'contexts/Connect/Utils';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';

export const Reader = () => {
  const { t } = useTranslation('modals');
  const {
    networkData: { ss58 },
  } = useNetwork();
  const { addOtherAccounts } = useOtherAccounts();
  const { setStatus: setPromptStatus } = usePrompt();
  const { addVaultAccount, vaultAccountExists, vaultAccounts } =
    useVaultAccounts();

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
    !formatAccountSs58(qrData, ss58);

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
          ? formatAccountSs58(qrData, ss58)
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
