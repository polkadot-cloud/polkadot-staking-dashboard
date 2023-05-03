// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import React from 'react';
import type { SubmitProps } from './types';

export const Default = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  customEvent,
}: SubmitProps & { buttons?: Array<React.ReactNode> }) => {
  const { txFeesValid } = useTxMeta();
  const { activeAccount, accountHasSigner } = useConnect();
  const disabled =
    submitting || !valid || !accountHasSigner(activeAccount) || !txFeesValid;

  return (
    <>
      <div>
        <EstimatedTxFee />
      </div>
      <div>
        {buttons}
        <ButtonSubmit
          text={`${submitText}`}
          iconLeft={faArrowAltCircleUp}
          iconTransform="grow-2"
          onClick={() => onSubmit(customEvent)}
          disabled={disabled}
          pulse={!disabled}
        />
      </div>
    </>
  );
};
