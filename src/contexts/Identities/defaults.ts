// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IdentitiesContextInterface } from './types';

export const defaultIdentitiesContext: IdentitiesContextInterface = {
  // eslint-disable-next-line
  fetchIdentitiesMetaBatch: (k, v, r) => {},
  meta: {},
};
