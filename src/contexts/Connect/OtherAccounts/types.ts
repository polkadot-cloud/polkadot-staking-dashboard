// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@polkadot-cloud/react/types';
import type { MaybeAddress, NetworkName } from 'types';
import type { ExternalAccountImportType } from '../ExternalAccounts/types';

export interface OtherAccountsContextInterface {
  addOtherAccounts: (a: ImportedAccount[]) => void;
  addOrReplaceOtherAccount: (
    a: ImportedAccount,
    type: ExternalAccountImportType
  ) => void;
  renameOtherAccount: (a: MaybeAddress, n: string) => void;
  importLocalOtherAccounts: (g: (n: NetworkName) => ImportedAccount[]) => void;
  forgetOtherAccounts: (a: ImportedAccount[]) => void;
  accountsInitialised: boolean;
  otherAccounts: ImportedAccount[];
}
