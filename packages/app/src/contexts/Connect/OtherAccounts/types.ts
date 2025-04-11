// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HardwareAccountSource, ImportedAccount } from '@w3ux/types'
import type { MaybeAddress, NetworkId } from 'types'
import type { ExternalAccountImportType } from '../ExternalAccounts/types'

export interface OtherAccountsContextInterface {
  addOtherAccounts: (accounts: ImportedAccount[]) => void
  addOrReplaceOtherAccount: (
    account: ImportedAccount,
    type: ExternalAccountImportType
  ) => void
  renameOtherAccount: (address: MaybeAddress, newName: string) => void
  importLocalOtherAccounts: <T extends HardwareAccountSource | string>(
    source: T,
    getter: (source: T, network: NetworkId) => ImportedAccount[]
  ) => void
  forgetOtherAccounts: (accounts: ImportedAccount[]) => void
  accountsInitialised: boolean
  otherAccounts: ImportedAccount[]
}
