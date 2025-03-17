// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionAccount, ImportedAccount } from '@w3ux/types'
import type { MaybeAddress } from 'types'

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[]
  getAccount: (address: MaybeAddress) => ExtensionAccount | null
  isReadOnlyAccount: (address: MaybeAddress) => boolean
  accountHasSigner: (address: MaybeAddress) => boolean
  requiresManualSign: (address: MaybeAddress) => boolean
}
