// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { appendOrEmpty } from '@w3ux/utils';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import { useWalletConnect } from 'contexts/WalletConnect';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge';
import type { SubmitProps } from 'library/SubmitTx/types';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSubmit } from 'ui-buttons';

export const WalletConnect = ({
  uid,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { t } = useTranslation('library');
  const { accountHasSigner } = useImportedAccounts();
  const { txFeesValid, getTxSubmission } = useTxMeta();
  const { wcSessionActive, connectProvider, fetchAddresses } =
    useWalletConnect();

  const txSubmission = getTxSubmission(uid);
  const from = txSubmission?.from || null;

  // The state under which submission is disabled.
  const disabled = !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonOnClick: () => void;
  let buttonDisabled: boolean;
  let buttonPulse: boolean;

  const connectAndSubmit = async () => {
    // If Wallet Connect session is not active, re-connect.
    if (!wcSessionActive) {
      await connectProvider();
    }
    const wcAccounts = await fetchAddresses();
    const accountExists = from && wcAccounts.includes(from);
    if (!from || !accountExists) {
      return;
    }
    onSubmit();
  };

  if (submitting) {
    buttonOnClick = connectAndSubmit;
    buttonDisabled = disabled;
    buttonPulse = false;
  } else {
    buttonOnClick = connectAndSubmit;
    buttonDisabled = disabled;
    buttonPulse = !disabled;
  }

  const buttonText = submitting ? submitText || '' : t('sign');

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
