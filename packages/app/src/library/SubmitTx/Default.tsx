// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { appendOrEmpty } from '@w3ux/utils';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import type { ReactNode } from 'react';
import { ButtonSubmit } from 'ui-buttons';
import { ButtonSubmitLarge } from './ButtonSubmitLarge';
import type { SubmitProps } from './types';

export const Default = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  customEvent,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { txFeesValid } = useTxMeta();
  const { accountHasSigner } = useImportedAccounts();

  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  return (
    <>
      <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
        <div>
          <EstimatedTxFee />
        </div>
        <div>
          {buttons}
          {displayFor !== 'card' && (
            <ButtonSubmit
              lg={displayFor === 'canvas'}
              text={submitText || ''}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => onSubmit(customEvent)}
              disabled={disabled}
              pulse={!disabled}
            />
          )}
        </div>
      </div>
      {displayFor === 'card' && (
        <ButtonSubmitLarge
          disabled={disabled}
          onSubmit={() => onSubmit(customEvent)}
          submitText={submitText || ''}
          icon={faArrowAltCircleUp}
          pulse={!disabled}
        />
      )}
    </>
  );
};
