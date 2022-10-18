// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountContextInterface } from './types';

export const defaultAccountContext: AccountContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchAccountMetaBatch: (k, v, r) => { },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeAccountMetaBatch: (k) => {},
  meta: {},
};
