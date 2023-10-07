// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ConnectContextInterface } from 'contexts/Connect/types';

export const defaultConnectContext: ConnectContextInterface = {
  addExternalAccount: (a, b) => {},
  addOtherAccounts: (a) => {},
  renameOtherAccount: (a, n) => {},
  importLocalAccounts: (n) => {},
  forgetOtherAccounts: (a) => {},
  forgetExternalAccounts: (a) => {},
  otherAccounts: [],
};

export const defaultHandleImportExtension = {
  newAccounts: [],
  meta: {
    removedActiveAccount: null,
  },
};
