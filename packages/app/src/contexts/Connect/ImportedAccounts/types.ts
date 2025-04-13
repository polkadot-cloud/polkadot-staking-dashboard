// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount, MaybeAddress } from 'types'

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[]
  getAccount: (address: MaybeAddress) => ImportedAccount | null
  isReadOnlyAccount: (address: MaybeAddress) => boolean
  accountHasSigner: (address: MaybeAddress) => boolean
  requiresManualSign: (address: MaybeAddress) => boolean
  stringifiedAccountsKey: string
}
