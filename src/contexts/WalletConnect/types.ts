// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, AnyJson } from '@w3ux/types';

export interface WalletConnectContextInterface {
  connectProvider: () => Promise<void>;
  wcInitialized: boolean;
  wcSessionActive: boolean;
  initializeWcSession: () => Promise<AnyJson>;
  updateWcSession: () => Promise<void>;
  disconnectWcSession: () => Promise<void>;
  fetchAddresses: () => Promise<string[]>;
  signWcTx: (
    caip: string,
    payload: AnyJson,
    from: string
  ) => Promise<string | null>;
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined;
  approval: AnyFunction;
}
