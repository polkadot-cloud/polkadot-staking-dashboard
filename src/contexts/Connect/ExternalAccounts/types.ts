// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ExternalAccount,
  ExternalAccountAddedBy,
} from '@polkadot-cloud/react/types';

export interface ExternalAccountsContextInterface {
  addExternalAccount: (
    address: string,
    addedBy: ExternalAccountAddedBy
  ) => AddExternalAccountResult | null;
  forgetExternalAccounts: (accounts: ExternalAccount[]) => void;
}

export interface AddExternalAccountResult {
  account: ExternalAccount;
  type: ExternalAccountImportType;
}

export type ExternalAccountImportType = 'new' | 'replace';
