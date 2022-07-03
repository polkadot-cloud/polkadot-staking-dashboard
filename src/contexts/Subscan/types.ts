// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface SubscanContextInterface {
  fetchEraPoints: (v: string, e: number) => void;
  payouts: any;
}
