// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubscanContextInterface } from '.';

export const defaultSubscanContext: SubscanContextInterface = {
  // eslint-disable-next-line
  fetchEraPoints: (v: string, e: number) => {},
  payouts: [],
};
