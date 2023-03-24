// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerAccount } from 'contexts/Connect/types';
import type { AnyJson, MaybeString } from 'types';

export type LedgerHardwareContextInterface = {
  pairDevice: () => Promise<boolean>;
  setIsPaired: (v: PairingStatus) => void;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    transport: AnyJson,
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => Promise<void>;
  handleNewStatusCode: (ack: string, statusCode: string) => void;
  setIsExecuting: (v: boolean) => void;
  resetStatusCodes: () => void;
  getIsExecuting: () => boolean;
  getStatusCodes: () => Array<LedgerResponse>;
  handleErrors: (e: AnyJson) => void;
  getTransport: () => AnyJson;
  ledgerAccountExists: (a: string) => boolean;
  addLedgerAccount: (a: string, i: number) => LedgerAccount | null;
  removeLedgerAccount: (a: string) => void;
  renameLedgerAccount: (a: string, name: string) => void;
  getLedgerAccount: (a: string) => LedgerAccount | null;
  isPaired: PairingStatus;
  ledgerAccounts: Array<LedgerAccount>;
  getDefaultMessage: () => MaybeString;
  setDefaultMessage: (s: MaybeString) => void;
};

export interface LedgerResponse {
  ack: string;
  statusCode: string;
  body?: AnyJson;
  options?: AnyJson;
}

export type LedgerTask = 'get_address' | 'sign_tx';

export type PairingStatus = 'paired' | 'unpaired' | 'unknown';
