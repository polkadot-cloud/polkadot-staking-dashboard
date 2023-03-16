// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from 'types';

export type LedgerHardwareContextInterface = {
  ledgerDeviceInfo: AnyJson;
  pairDevice: () => Promise<void>;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    transport: AnyJson,
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => Promise<void>;
  setIsPaired: (v: PairingStatus) => void;
  handleNewStatusCode: (ack: string, statusCode: string) => void;
  setIsImporting: (v: boolean) => void;
  cancelImport: () => void;
  resetStatusCodes: () => void;
  getIsImporting: () => boolean;
  getStatusCodes: () => Array<LedgerResponse>;
  isPaired: PairingStatus;
  handleErrors: (e: AnyJson) => void;
  transport: AnyJson;
};

export interface LedgerResponse {
  ack: string;
  statusCode: string;
  body?: AnyJson;
  options?: AnyJson;
}

export type LedgerTask = 'get_address' | 'get_device_info';

export type PairingStatus = 'paired' | 'unpaired' | 'unknown';
