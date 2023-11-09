// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ExtensionAccount,
  ImportedAccount,
} from '@polkadot-cloud/react/types';
import type { MaybeAddress } from 'types';

export type AccountSource = 'extension' | 'ledger' | 'vault' | 'external';

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[];
  getAccount: (address: MaybeAddress) => ExtensionAccount | null;
  importAccount: (
    source: AccountSource,
    address: string,
    options?: {
      index?: number;
      addedBy?: 'user' | 'system';
    }
  ) => ImportedAccount | null;
  isReadOnlyAccount: (address: MaybeAddress) => boolean;
  accountHasSigner: (address: MaybeAddress) => boolean;
  requiresManualSign: (address: MaybeAddress) => boolean;
}
