// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useVaultAccounts } from '@w3ux/react-connect-kit';
import type { AnyJson } from '@w3ux/types';
import { formatAccountSs58, isValidAddress } from '@w3ux/utils';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useNetwork } from 'contexts/Network';
import { usePrompt } from 'contexts/Prompt';
import { QRViewerWrapper } from 'library/Import/Wrappers';
import { QrScanSignature } from 'library/QRCode/ScanSignature';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSecondary } from 'ui-buttons';
import { registerSaEvent } from 'Utils';

export const Reader = () => {
  const { t } = useTranslation('modals');
  const {
    network,
    networkData: { ss58 },
  } = useNetwork();
  const { closePrompt } = usePrompt();
  const { addOtherAccounts } = useOtherAccounts();
  const { addVaultAccount, vaultAccountExists, getVaultAccounts } =
    useVaultAccounts();

  const vaultAccounts = getVaultAccounts(network);

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<AnyJson>(undefined);

  // Store QR data feedback.
  const [feedback, setFeedback] = useState<string>('');

  const handleQrData = (signature: string) => {
    setQrData(signature.split(':')?.[1] || '');
  };

  const valid =
    isValidAddress(qrData) &&
    !vaultAccountExists(network, qrData) &&
    formatAccountSs58(qrData, ss58) === qrData;

  // Reset QR data on open.
  useEffect(() => {
    setQrData(undefined);
  }, []);

  useEffect(() => {
    // Add account and close overlay if valid.
    if (valid) {
      const account = addVaultAccount(network, qrData, vaultAccounts.length);
      if (account) {
        registerSaEvent(`${network.toLowerCase()}_vault_account_import`);
        addOtherAccounts([account]);
      }
      closePrompt();
    }

    // Display feedback.
    setFeedback(
      qrData === undefined
        ? `${t('waitingForQRCode')}`
        : isValidAddress(qrData)
          ? formatAccountSs58(qrData, ss58) !== qrData
            ? `${t('differentNetworkAddress')}`
            : vaultAccountExists(network, qrData)
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
          size={250}
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
            onClick={() => closePrompt()}
          />
        </div>
      </div>
    </QRViewerWrapper>
  );
};
