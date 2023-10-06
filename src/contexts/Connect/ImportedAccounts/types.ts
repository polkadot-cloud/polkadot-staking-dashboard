// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAccount } from 'types';
import type { ExtensionAccount } from '@polkadot-cloud/react/connect/ExtensionsProvider/types';
import type { ImportedAccount } from '../types';

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[];
  getAccount: (account: MaybeAccount) => ExtensionAccount | null;
  isReadOnlyAccount: (a: MaybeAccount) => boolean;
  accountHasSigner: (a: MaybeAccount) => boolean;
  requiresManualSign: (a: MaybeAccount) => boolean;
}
