// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface ExtrinsicsContextInterface {
  addPending: (n: string) => void;
  removePending: (n: string) => void;
  pending: string[];
}
