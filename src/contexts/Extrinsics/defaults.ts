// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ExtrinsicsContextInterface } from './types';

export const defaultExtrinsicsContext: ExtrinsicsContextInterface = {
  addPending: (t) => {},
  removePending: (t) => {},
  pending: [],
};
