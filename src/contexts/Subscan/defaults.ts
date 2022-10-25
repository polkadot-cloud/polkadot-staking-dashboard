// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubscanContextInterface } from './types';

export const defaultSubscanContext: SubscanContextInterface = {
  // eslint-disable-next-line
  fetchEraPoints: (v, e) => {},
  payouts: [],
  poolClaims: [],
};
