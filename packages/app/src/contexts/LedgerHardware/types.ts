// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { FunctionComponent, SVGProps } from 'react';
import type { MaybeString, NetworkName } from 'types';

export interface LedgerHardwareContextInterface {
  integrityChecked: boolean;
  setIntegrityChecked: (checked: boolean) => void;
  checkRuntimeVersion: (txMetadataChainId: string) => Promise<void>;
  transportResponse: AnyJson;
  setStatusCode: (ack: string, statusCode: LedgerStatusCode) => void;
  setIsExecuting: (v: boolean) => void;
  getStatusCode: () => LedgerResponse | null;
  resetStatusCode: () => void;
  getIsExecuting: () => boolean;
  getFeedback: () => FeedbackMessage;
  setFeedback: (s: MaybeString, helpKey?: MaybeString) => void;
  resetFeedback: () => void;
  handleUnmount: () => void;
  handleErrors: (err: unknown) => void;
  runtimesInconsistent: boolean;
  handleGetAddress: (
    txMetadataChainId: string,
    accountIndex: number,
    ss58Prefix: number
  ) => Promise<void>;
  handleSignTx: (
    txMetadataChainId: string,
    uid: number,
    index: number,
    payload: AnyJson,
    txMetadata: AnyJson
  ) => Promise<void>;
  handleResetLedgerTask: () => void;
}

export interface FeedbackMessage {
  message: MaybeString;
  helpKey?: MaybeString;
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
  | 'AppNotOpen';

export interface LedgerResponse {
  ack: string;
  statusCode: LedgerStatusCode;
  body?: AnyJson;
  options?: AnyJson;
}

export type LedgerTask = 'get_address' | 'sign_tx';

export type PairingStatus = 'paired' | 'unpaired' | 'unknown';

export interface LedgerAddress {
  address: string;
  index: number;
  name: string;
  network: NetworkName;
  pubKey: string;
}

export interface LedgerChain {
  network: NetworkName;
  txMetadataChainId: string;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface HandleErrorFeedback {
  message: MaybeString;
  helpKey?: MaybeString;
  code: LedgerStatusCode;
}
