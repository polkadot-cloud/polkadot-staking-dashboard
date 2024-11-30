// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import type { ReactNode } from 'react';
import type { SubmitProps } from '../types';
import { Ledger } from './Ledger';
import { Vault } from './Vault';
import { WalletConnect } from './WalletConnect';

export const ManualSign = (
  props: SubmitProps & { buttons?: ReactNode[]; notEnoughFunds: boolean }
) => {
  const { getTxSubmission } = useTxMeta();
  const { getAccount } = useImportedAccounts();
  const from = getTxSubmission(props.uid)?.from || null;

  const accountMeta = getAccount(from);
  const source = accountMeta?.source;

  // Determine which signing method to use. NOTE: Falls back to `ledger` on all other sources to
  // ensure submit button is displayed.
  switch (source) {
    case 'vault':
      return <Vault {...props} />;
    case 'wallet_connect':
      return <WalletConnect {...props} />;
    default:
      return <Ledger {...props} />;
  }
};
