// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import type { SubmitProps } from '../../types';
import { SignPrompt } from './SignPrompt';
import { ButtonSubmit } from 'kits/Buttons/ButtonSubmit';
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge';
import { appendOrEmpty } from '@w3ux/utils';

export const Vault = ({
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
  const { txFeesValid, getTxSignature } = useTxMeta();
  const { openPromptWith, status: promptStatus } = usePrompt();

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonText: string;
  let buttonOnClick: () => void;
  let buttonDisabled: boolean;
  let buttonPulse: boolean;

  if (getTxSignature() !== null || submitting) {
    buttonText = submitText || '';
    buttonOnClick = onSubmit;
    buttonDisabled = disabled;
    buttonPulse = !(!valid || promptStatus !== 0);
  } else {
    buttonText = promptStatus === 0 ? t('sign') : t('signing');
    buttonOnClick = async () => {
      openPromptWith(<SignPrompt submitAddress={submitAddress} />, 'small');
    };
    buttonDisabled = disabled || promptStatus !== 0;
    buttonPulse = !disabled || promptStatus === 0;
  }

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
