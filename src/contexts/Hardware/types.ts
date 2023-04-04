// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerAccount } from 'contexts/Connect/types';
import type { FunctionComponent, SVGProps } from 'react';
import type { AnyJson, MaybeString, NetworkName } from 'types';

export type LedgerHardwareContextInterface = {
  pairDevice: () => Promise<boolean>;
  setIsPaired: (v: PairingStatus) => void;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    appName: string,
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => Promise<void>;
  handleNewStatusCode: (
    ack: string,
    statusCode: string,
    helpKey?: string
  ) => void;
  setIsExecuting: (v: boolean) => void;
  resetStatusCodes: () => void;
  getIsExecuting: () => boolean;
  getStatusCodes: () => Array<LedgerResponse>;
  getTransport: () => AnyJson;
  ledgerAccountExists: (a: string) => boolean;
  addLedgerAccount: (a: string, i: number) => LedgerAccount | null;
  removeLedgerAccount: (a: string) => void;
  renameLedgerAccount: (a: string, name: string) => void;
  getLedgerAccount: (a: string) => LedgerAccount | null;
  isPaired: PairingStatus;
  ledgerAccounts: Array<LedgerAccount>;
  getDefaultMessage: () => [MaybeString, MaybeString];
  setDefaultMessage: (s: MaybeString, helpKey?: string) => void;
  handleUnmount: () => void;
};

export interface LedgerResponse {
  ack: string;
  statusCode: string;
  body?: AnyJson;
  options?: AnyJson;
  helpKey?: string;
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
