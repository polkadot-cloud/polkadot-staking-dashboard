// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EstimatedTxFee } from 'library/EstimatedTxFee';
import React from 'react';
import { Submit } from './Submit';
import type { SubmitProps } from './types';

// TODO: integrate useLedgerLoop

export const ManualSign = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
}: SubmitProps & { buttons?: Array<React.ReactNode> }) => {
  return (
    <>
      <div>
        <EstimatedTxFee />
      </div>
      <div>
        {buttons}
        <Submit
          onSubmit={onSubmit}
          submitting={submitting}
          valid={valid}
          submitText={submitText}
        />
      </div>
    </>
  );
};
