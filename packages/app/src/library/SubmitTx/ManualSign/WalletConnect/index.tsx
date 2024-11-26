// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { appendOrEmpty } from '@w3ux/utils';
import { useApi } from 'contexts/Api';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import { useWalletConnect } from 'contexts/WalletConnect';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSubmit } from 'ui-buttons';
import type { SubmitProps } from '../../types';

export const WalletConnect = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { t } = useTranslation('library');
  const { api } = useApi();
  const { accountHasSigner } = useImportedAccounts();
  const { wcSessionActive, connectProvider, fetchAddresses, signWcTx } =
    useWalletConnect();
  const { txFeesValid, sender, getTxPayloadJson, setTxSignature } = useTxMeta();

  // Store whether the user is currently signing a transaction.
  const [isSgning, setIsSigning] = useState<boolean>(false);

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;
  const alreadySubmitted = submitting;

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonOnClick: () => void;
  let buttonDisabled: boolean;
  let buttonPulse: boolean;

  if (alreadySubmitted) {
    buttonOnClick = onSubmit;
    buttonDisabled = disabled;
    buttonPulse = valid;
  } else {
    buttonOnClick = async () => {
      if (!api) {
        return;
      }

      // If Wallet Connect session is not active, re-connect.
      if (!wcSessionActive) {
        await connectProvider();
      }

      const wcAccounts = await fetchAddresses();
      const accountExists = sender && wcAccounts.includes(sender);

      const payload = getTxPayloadJson();
      if (!sender || !payload || !accountExists) {
        return;
      }

      setIsSigning(true);

      const caip = `polkadot:${api.genesisHash.toHex().substring(2).substring(0, 32)}`;

      try {
        const signature = await signWcTx(caip, payload, sender);
        if (signature) {
          setTxSignature(signature);
        }
      } catch (e) {
        setIsSigning(false);
      }
      setIsSigning(false);
    };

    buttonDisabled = disabled;
    buttonPulse = !disabled;
  }

  const buttonText = alreadySubmitted
    ? submitText || ''
    : isSgning
      ? t('signing')
      : t('sign');

  return (
    <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
      <div>
        <EstimatedTxFee />
        {valid ? <p>{t('submitTransaction')}</p> : <p>...</p>}
      </div>
      <div>
        {buttons}
        {displayFor !== 'card' ? (
          <ButtonSubmit
            disabled={buttonDisabled}
            lg={displayFor === 'canvas'}
            text={buttonText}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={() => buttonOnClick()}
            pulse={buttonPulse}
          />
        ) : (
          <ButtonSubmitLarge
            disabled={disabled}
            submitText={buttonText}
            onSubmit={buttonOnClick}
            icon={faSquarePen}
            pulse={!disabled}
          />
        )}
      </div>
    </div>
  );
};
