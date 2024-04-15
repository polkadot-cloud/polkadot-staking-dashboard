// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isValidAddress } from '@w3ux/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import { QRViewerWrapper } from 'library/Import/Wrappers';
import { QrScanSignature } from 'library/QRCode/ScanSignature';
import { useNetwork } from 'contexts/Network';
import { formatAccountSs58 } from 'contexts/Connect/Utils';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import type { AnyJson } from 'types';
import { ButtonSecondary } from 'kits/Buttons/ButtonSecondary';
import { useVaultAccounts } from '@w3ux/react-connect-kit';

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
    !formatAccountSs58(qrData, ss58);

  // Reset QR data on open.
  useEffect(() => {
    setQrData(undefined);
  }, []);

  useEffect(() => {
    // Add account and close overlay if valid.
    if (valid) {
      const account = addVaultAccount(network, qrData, vaultAccounts.length);
      if (account) {
        addOtherAccounts([account]);
      }
      closePrompt();
    }

    // Display feedback.
    setFeedback(
      qrData === undefined
        ? `${t('waitingForQRCode')}`
        : isValidAddress(qrData)
          ? formatAccountSs58(qrData, ss58)
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
