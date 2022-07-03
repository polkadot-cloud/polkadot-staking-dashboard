// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtrinsicsContextInterface } from '.';

export const defaultExtrinsicsContext: ExtrinsicsContextInterface = {
  // eslint-disable-next-line
  addPending: (t: any) => {},
  // eslint-disable-next-line
  removePending: (t: any) => {},
  pending: [],
};
