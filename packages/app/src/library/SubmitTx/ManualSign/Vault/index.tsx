// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { appendOrEmpty } from '@w3ux/utils';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { usePrompt } from 'contexts/Prompt';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSubmit } from 'ui-buttons';
import type { SubmitProps } from '../../types';

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
  const { txFeesValid } = useTxMeta();
  const { status: promptStatus } = usePrompt();
  const { accountHasSigner } = useImportedAccounts();

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonText: string;
  let buttonDisabled: boolean;
  let buttonPulse: boolean;

  if (submitting) {
    buttonText = submitText || '';
    buttonDisabled = disabled;
    buttonPulse = !(!valid || promptStatus !== 0);
  } else {
    buttonText = t('sign');
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
            onClick={() => onSubmit()}
            pulse={buttonPulse}
          />
        ) : (
          <ButtonSubmitLarge
            disabled={disabled}
            submitText={buttonText}
            onSubmit={onSubmit}
            icon={faSquarePen}
            pulse={!disabled}
          />
        )}
      </div>
    </div>
  );
};
