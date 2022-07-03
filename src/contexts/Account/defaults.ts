// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountContextInterface } from '.';

export const defaultAccountContext: AccountContextInterface = {
  // eslint-disable-next-line
  fetchAccountMetaBatch: (k: string, v: string[], r?: boolean) => {},
  // eslint-disable-next-line
  removeAccountMetaBatch: (k: string) => {},
  meta: {},
};
