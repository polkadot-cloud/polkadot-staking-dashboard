// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTxMeta } from 'contexts/TxMeta';
import React, { useEffect } from 'react';
import type { SubmitProps } from '../types';
import { Ledger } from './Ledger';

export const ManualSign = (
  props: SubmitProps & { buttons?: React.ReactNode[] }
) => {
  const { getTxSignature } = useTxMeta();

  const { onSubmit } = props;

  // Automatically submit transaction once it is signed.
  useEffect(() => {
    if (getTxSignature() !== null) {
      onSubmit();
    }
  }, [getTxSignature()]);

  return (
    <>
      <Ledger {...props} />
    </>
  );
};
