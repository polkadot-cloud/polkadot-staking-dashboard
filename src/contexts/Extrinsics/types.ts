// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Index } from '@polkadot/types/interfaces';

export interface ExtrinsicsContextInterface {
  addPending: (n: Index) => void;
  removePending: (n: Index) => void;
  pending: Index[];
}
