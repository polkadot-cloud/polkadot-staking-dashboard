// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from 'types';

export type LedgerHardwareContextInterface = {
  transportError: LedgerResponse | null;
  ledgerDeviceInfo: AnyJson;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => Promise<void>;
  handleNewStatusCode: (ack: string, statusCode: string) => void;
  setIsImporting: (v: boolean) => void;
  cancelImport: () => void;
  resetStatusCodes: () => void;
  getIsImporting: () => boolean;
  statusCodes: Array<LedgerResponse>;
};

export type LedgerTask = 'get_address' | 'get_device_info';

export interface LedgerResponse {
  ack: string;
  statusCode: string;
  body?: AnyJson;
  options?: AnyJson;
}
