// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountContextInterface } from './types';

export const defaultAccountContext: AccountContextInterface = {
  address: undefined,
  role: undefined,
  update: () => {},
};
