// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountAddedBy, ExternalAccount } from 'types'

export interface ExternalAccountsContextInterface {
  addExternalAccount: (
    address: string,
    addedBy: AccountAddedBy
  ) => AddExternalAccountResult | null
  forgetExternalAccounts: (accounts: ExternalAccount[]) => void
}

export interface AddExternalAccountResult {
  account: ExternalAccount
  type: ExternalAccountImportType
}

export type ExternalAccountImportType = 'new' | 'replace'
