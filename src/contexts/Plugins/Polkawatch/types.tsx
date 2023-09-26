// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkawatchApi } from '@polkawatch/ddp-client';

/**
 * The provider will return an API and also information about whether the selected network has decentralization
 * analytics support.
 */
export interface PolkawatchState {
  pwApi: PolkawatchApi;
  networkSupported: boolean;
}
