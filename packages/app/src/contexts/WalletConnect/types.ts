// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HexString } from 'dedot/utils'

// WalletConnect session object - using unknown since it's from external library
export type WalletConnectSession = unknown

// Transaction payload for WalletConnect signing
export interface WalletConnectTxPayload {
  address: string
  [key: string]: unknown
}

// Function type for WalletConnect approval
export type WalletConnectApprovalFunction = () => Promise<WalletConnectSession>

export interface WalletConnectContextInterface {
  connectProvider: () => Promise<void>
  wcInitialized: boolean
  wcSessionActive: boolean
  initializeWcSession: () => Promise<WalletConnectSession | null>
  updateWcSession: () => Promise<void>
  disconnectWcSession: () => Promise<void>
  fetchAddresses: () => Promise<string[]>
  signWcTx: WalletConnectSignTx
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined
  approval: WalletConnectApprovalFunction
}

export type WalletConnectSignTx = (
  payload: WalletConnectTxPayload
) => Promise<{ signature: HexString }>
