// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@polkadot-cloud/react';
import React from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import type { SubmitProps } from './types';

export const Default = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: React.ReactNode[] }) => {
  const { txFeesValid } = useTxMeta();
  const { accountHasSigner } = useImportedAccounts();

  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  return (
    <div className="inner">
      <div>
        <EstimatedTxFee />
      </div>
      <div>
        {buttons}
        <ButtonSubmit
          lg={displayFor === 'canvas'}
          text={submitText || ''}
          iconLeft={faArrowAltCircleUp}
          iconTransform="grow-2"
          onClick={() => onSubmit()}
          disabled={disabled}
          pulse={!disabled}
        />
      </div>
    </div>
  );
};
