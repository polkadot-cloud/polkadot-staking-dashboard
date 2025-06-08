// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HexString } from 'dedot/utils'

// WalletConnect session object - flexible to match external library
export type WalletConnectSession = unknown

// Transaction payload for WalletConnect signing - should match SignerPayloadJSON structure
export interface WalletConnectTxPayload {
  address: string
  blockHash: string
  blockNumber: string
  era: string
  genesisHash: string
  method: string
  nonce: string
  specVersion: string
  tip: string
  transactionVersion: string
  version: number
  [key: string]: string | number // Allow any additional properties as strings or numbers
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
  payload: unknown // Accept any payload type to match external library requirements
) => Promise<{ signature: HexString }>
