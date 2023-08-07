// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtrinsicsContextInterface } from './types';

export const defaultExtrinsicsContext: ExtrinsicsContextInterface = {
  // eslint-disable-next-line
  addPending: (t) => {},
  // eslint-disable-next-line
  removePending: (t) => {},
  pending: [],
};
