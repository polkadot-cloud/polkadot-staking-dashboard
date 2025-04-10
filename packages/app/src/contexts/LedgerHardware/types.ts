// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { AnyJson, NetworkId } from 'types'

export interface LedgerHardwareContextInterface {
  integrityChecked: boolean
  setIntegrityChecked: (checked: boolean) => void
  checkRuntimeVersion: (txMetadataChainId: string) => Promise<void>
  transportResponse: AnyJson
  setStatusCode: (ack: string, statusCode: LedgerStatusCode) => void
  setIsExecuting: (v: boolean) => void
  getStatusCode: () => LedgerResponse | null
  resetStatusCode: () => void
  getIsExecuting: () => boolean
  getFeedback: () => FeedbackMessage
  setFeedback: (s: MaybeString, helpKey?: MaybeString) => void
  resetFeedback: () => void
  handleUnmount: () => void
  handleErrors: (err: unknown) => void
  runtimesInconsistent: boolean
  handleGetAddress: (
    txMetadataChainId: string,
    accountIndex: number,
    ss58Prefix: number
  ) => Promise<void>
  handleSignTx: (
    txMetadataChainId: string,
    uid: number,
    index: number,
    payload: AnyJson,
    txMetadata: AnyJson
  ) => Promise<void>
  handleResetLedgerTask: () => void
}

export interface FeedbackMessage {
  message: MaybeString
  helpKey?: MaybeString
}

export type LedgerStatusCode =
  | 'GettingAddress'
  | 'ReceivedAddress'
  | 'SigningPayload'
  | 'SignedPayload'
  | 'DeviceBusy'
  | 'DeviceTimeout'
  | 'MethodNotSupported'
  | 'NestingNotSupported'
  | 'WrongTransaction'
  | 'DeviceNotConnected'
  | 'DeviceLocked'
  | 'TransactionVersionNotSupported'
  | 'TransactionRejected'
  | 'AppNotOpenContinue'
  | 'AppNotOpen'

export interface LedgerResponse {
  ack: string
  statusCode: LedgerStatusCode
  body?: AnyJson
  options?: AnyJson
}

export type LedgerTask = 'get_address' | 'sign_tx'

export type PairingStatus = 'paired' | 'unpaired' | 'unknown'

export interface LedgerAddress {
  address: string
  index: number
  name: string
  network: NetworkId
  pubKey: string
}

export interface LedgerChain {
  network: NetworkId
  txMetadataChainId: string
}

export interface HandleErrorFeedback {
  message: MaybeString
  helpKey?: MaybeString
  code: LedgerStatusCode
}
