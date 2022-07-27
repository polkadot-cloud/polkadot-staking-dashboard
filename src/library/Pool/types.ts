// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolAddresses } from 'contexts/Pools/types';

export interface PoolProps {
  pool: Props;
  batchKey: string;
  batchIndex: number;
}

export interface Props {
  memberCounter: string;
  addresses: PoolAddresses;
  id: number;
}
