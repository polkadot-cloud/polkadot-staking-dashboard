// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnySubscan } from 'types';

export interface SubscanContextInterface {
  fetchEraPoints: (v: string, e: number) => void;
  payouts: AnySubscan;
  unclaimedPayouts: AnySubscan;
  poolClaims: AnySubscan;
}
