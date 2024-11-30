// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { WalletConnectContextInterface } from './types';

export const defaultWalletConnect: WalletConnectContextInterface = {
  connectProvider: () => Promise.resolve(),
  wcInitialized: false,
  initializeWcSession: () => Promise.resolve(),
  updateWcSession: () => Promise.resolve(),
  disconnectWcSession: () => Promise.resolve(),
  wcSessionActive: false,
  fetchAddresses: () => Promise.resolve([]),
  signWcTx: (payload) => Promise.resolve({ signature: '0x' }),
};
