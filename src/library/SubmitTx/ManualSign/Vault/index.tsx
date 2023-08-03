// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/core-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { usePrompt } from 'contexts/Prompt';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import type { SubmitProps } from '../../types';
import { SignPrompt } from './SignPrompt';

export const Vault = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
}: SubmitProps & { buttons?: React.ReactNode[] }) => {
  const { t } = useTranslation('library');
  const { accountHasSigner } = useConnect();
  const { txFeesValid, getTxSignature } = useTxMeta();
  const { openPromptWith, status: promptStatus } = usePrompt();

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  return (
    <>
      <div>
        <EstimatedTxFee />
        {valid ? <p>{t('submitTransaction')}</p> : <p>...</p>}
      </div>
      <div>
        {buttons}
        {getTxSignature() !== null || submitting ? (
          <ButtonSubmit
            text={submitText || ''}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={() => onSubmit()}
            disabled={disabled}
            pulse={!(!valid || promptStatus !== 0)}
          />
        ) : (
          <ButtonSubmit
            text={promptStatus === 0 ? t('sign') : t('signing')}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={async () => {
              openPromptWith(
                <SignPrompt submitAddress={submitAddress} />,
                'small'
              );
            }}
            disabled={disabled || promptStatus !== 0}
            pulse={!disabled || promptStatus === 0}
          />
        )}
      </div>
    </>
  );
};
