// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface ExtrinsicsContextInterface {
  addPending: (n: string) => void;
  removePending: (n: string) => void;
  pending: string[];
}
