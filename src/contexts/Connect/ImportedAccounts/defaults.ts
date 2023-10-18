// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ImportedAccountsContextInterface } from './types';

export const defaultImportedAccountsContext: ImportedAccountsContextInterface =
  {
    accounts: [],
    getAccount: (a) => null,
    isReadOnlyAccount: (a) => false,
    accountHasSigner: (a) => false,
    requiresManualSign: (a) => false,
  };
