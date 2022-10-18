// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtrinsicsContextInterface } from './types';

export const defaultExtrinsicsContext: ExtrinsicsContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addPending: (t) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removePending: (t) => {},
  pending: [],
};
