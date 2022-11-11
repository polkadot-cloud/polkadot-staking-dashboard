// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountContextInterface } from './types';

export const defaultAccountContext: AccountContextInterface = {
  // eslint-disable-next-line
  fetchAccountMetaBatch: (k, v, r) => { },
  meta: {},
};
