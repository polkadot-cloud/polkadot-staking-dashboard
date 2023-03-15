// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from 'types';

export type LedgerHardwareContextInterface = {
  ledgerDeviceInfo: AnyJson;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => Promise<void>;
  setIsPaired: (v: PairingStatus) => void;
  handleNewStatusCode: (ack: string, statusCode: string) => void;
  setIsImporting: (v: boolean) => void;
  cancelImport: () => void;
  checkPaired: () => Promise<boolean>;
  resetStatusCodes: () => void;
  getIsImporting: () => boolean;
  getStatusCodes: () => Array<LedgerResponse>;
  isPaired: PairingStatus;
};

export interface LedgerResponse {
  ack: string;
  statusCode: string;
  body?: AnyJson;
  options?: AnyJson;
}

export type LedgerTask = 'get_address' | 'get_device_info';

export type PairingStatus = 'paired' | 'unpaired' | 'unknown';
