// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ExternalAccountsContextInterface } from './types';

export const defaultExternalAccountsContext: ExternalAccountsContextInterface =
  {
    addExternalAccount: (address, addedBy) => null,
    forgetExternalAccounts: (accounts) => {},
  };
