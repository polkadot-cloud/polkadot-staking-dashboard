// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';
import type { ExtensionAccount } from '@polkadot-cloud/react/connect/ExtensionsProvider/types';
import type { ImportedAccount } from '@polkadot-cloud/react/connect/types';

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[];
  getAccount: (account: MaybeAddress) => ExtensionAccount | null;
  isReadOnlyAccount: (a: MaybeAddress) => boolean;
  accountHasSigner: (a: MaybeAddress) => boolean;
  requiresManualSign: (a: MaybeAddress) => boolean;
}
