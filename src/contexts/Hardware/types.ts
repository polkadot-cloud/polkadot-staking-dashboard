// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  LedgerAccount,
  VaultAccount,
} from '@polkadot-cloud/react/connect/types';
import type { FunctionComponent, SVGProps } from 'react';
import type { AnyJson, MaybeString, NetworkName } from 'types';

export type LedgerHardwareContextInterface = {
  pairDevice: () => Promise<boolean>;
  setIsPaired: (v: PairingStatus) => void;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    appName: string,
    tasks: LedgerTask[],
    options?: AnyJson
  ) => Promise<void>;
  handleNewStatusCode: (ack: string, statusCode: LedgerStatusCode) => void;
  setIsExecuting: (v: boolean) => void;
  resetStatusCodes: () => void;
  getIsExecuting: () => boolean;
  getStatusCodes: () => LedgerResponse[];
  getTransport: () => AnyJson;
  ledgerAccountExists: (a: string) => boolean;
  addLedgerAccount: (a: string, i: number) => LedgerAccount | null;
  removeLedgerAccount: (a: string) => void;
  renameLedgerAccount: (a: string, name: string) => void;
  getLedgerAccount: (a: string) => LedgerAccount | null;
  isPaired: PairingStatus;
  ledgerAccounts: LedgerAccount[];
  getFeedback: () => FeedbackMessage;
  setFeedback: (s: MaybeString, helpKey?: MaybeString) => void;
  resetFeedback: () => void;
  handleUnmount: () => void;
};

export interface FeedbackMessage {
  message: MaybeString;
  helpKey?: MaybeString;
}

export type LedgerStatusCode =
  | 'GettingAddress'
  | 'ReceivedAddress'
  | 'SigningPayload'
  | 'SignedPayload'
  | 'DeviceTimeout'
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

export type LedgerApp = {
  network: NetworkName;
  appName: string;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
};

export type VaultHardwareContextInterface = {
  vaultAccountExists: (a: string) => boolean;
  addVaultAccount: (a: string, i: number) => LedgerAccount | null;
  removeVaultAccount: (a: string) => void;
  renameVaultAccount: (a: string, name: string) => void;
  getVaultAccount: (a: string) => LedgerAccount | null;
  vaultAccounts: VaultAccount[];
};
