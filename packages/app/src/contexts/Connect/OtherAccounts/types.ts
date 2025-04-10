// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountSource, ImportedAccount } from '@w3ux/types'
import type { NetworkId } from 'common-types'
import type { MaybeAddress } from 'types'
import type { ExternalAccountImportType } from '../ExternalAccounts/types'

export interface OtherAccountsContextInterface {
  addOtherAccounts: (accounts: ImportedAccount[]) => void
  addOrReplaceOtherAccount: (
    account: ImportedAccount,
    type: ExternalAccountImportType
  ) => void
  renameOtherAccount: (address: MaybeAddress, newName: string) => void
  importLocalOtherAccounts: <T extends AccountSource>(
    source: T,
    getter: (source: T, network: NetworkId) => ImportedAccount[]
  ) => void
  forgetOtherAccounts: (accounts: ImportedAccount[]) => void
  accountsInitialised: boolean
  otherAccounts: ImportedAccount[]
}
