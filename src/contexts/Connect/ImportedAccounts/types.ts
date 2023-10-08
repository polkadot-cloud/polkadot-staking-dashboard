// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ExtensionAccount,
  ImportedAccount,
} from '@polkadot-cloud/react/types';
import type { MaybeAddress } from 'types';

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[];
  getAccount: (account: MaybeAddress) => ExtensionAccount | null;
  isReadOnlyAccount: (a: MaybeAddress) => boolean;
  accountHasSigner: (a: MaybeAddress) => boolean;
  requiresManualSign: (a: MaybeAddress) => boolean;
}
