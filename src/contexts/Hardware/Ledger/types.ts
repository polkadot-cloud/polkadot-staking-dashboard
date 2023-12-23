// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FunctionComponent, SVGProps } from 'react';
import type { AnyJson, MaybeString, NetworkName } from 'types';

export interface LedgerHardwareContextInterface {
  integrityChecked: boolean;
  setIntegrityChecked: (checked: boolean) => void;
  checkRuntimeVersion: (appName: string) => Promise<void>;
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
  handleErrors: (appName: string, err: unknown) => void;
  runtimesInconsistent: boolean;
  handleGetAddress: (appName: string, accountIndex: number) => Promise<void>;
  handleSignTx: (
    appName: string,
    uid: number,
    index: number,
    payload: AnyJson
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

export interface LedgerApp {
  network: NetworkName;
  appName: string;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface HandleErrorFeedback {
  message: MaybeString;
  helpKey?: MaybeString;
  code: LedgerStatusCode;
}
