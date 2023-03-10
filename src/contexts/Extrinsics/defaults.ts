// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExtrinsicsContextInterface } from './types';

export const defaultExtrinsicsContext: ExtrinsicsContextInterface = {
  // eslint-disable-next-line
  addPending: (t) => {},
  // eslint-disable-next-line
  removePending: (t) => {},
  pending: [],
};
