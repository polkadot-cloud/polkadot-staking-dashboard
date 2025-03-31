// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, AnyJson } from 'types'

export interface WalletConnectContextInterface {
  connectProvider: () => Promise<void>
  wcInitialized: boolean
  wcSessionActive: boolean
  initializeWcSession: () => Promise<AnyJson>
  updateWcSession: () => Promise<void>
  disconnectWcSession: () => Promise<void>
  fetchAddresses: () => Promise<string[]>
  signWcTx: WalletConnectSignTx
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined
  approval: AnyFunction
}

export type WalletConnectSignTx = (
  payload: AnyJson
) => Promise<{ signature: string }>
