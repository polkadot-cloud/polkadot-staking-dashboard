// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';

export type LedgerHardwareContextInterface = {
  transportError: LedgerResponse | null;
  ledgerDeviceInfo: AnyJson;
  transportResponse: AnyJson;
  executeLedgerLoop: (
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => Promise<void>;
};

// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type LedgerTask = 'get_address' | 'get_device_info';

export interface LedgerResponse {
  ack: string;
  statusCode: string;
}
