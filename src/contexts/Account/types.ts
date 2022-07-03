// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyMetaBatch } from 'types';

export interface AccountContextInterface {
  fetchAccountMetaBatch: (k: string, v: string[], r?: boolean) => void;
  removeAccountMetaBatch: (k: string) => void;
  meta: AnyMetaBatch;
}
