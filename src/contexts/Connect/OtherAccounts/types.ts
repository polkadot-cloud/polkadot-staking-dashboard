// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type { MaybeAddress, NetworkName } from 'types';
import type { ExternalAccountImportType } from '../ExternalAccounts/types';

export interface OtherAccountsContextInterface {
  addOtherAccounts: (accounts: ImportedAccount[]) => void;
  addOrReplaceOtherAccount: (
    account: ImportedAccount,
    type: ExternalAccountImportType
  ) => void;
  renameOtherAccount: (address: MaybeAddress, newName: string) => void;
  importLocalOtherAccounts: (
    g: (network: NetworkName) => ImportedAccount[]
  ) => void;
  forgetOtherAccounts: (accounts: ImportedAccount[]) => void;
  accountsInitialised: boolean;
  otherAccounts: ImportedAccount[];
}
