// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyApi, MaybeAccount } from 'types';

export interface UseSubmitExtrinsicProps {
  tx: AnyApi;
  shouldSubmit: boolean;
  callbackSubmit: { (): void };
  callbackInBlock: { (): void };
  from: MaybeAccount;
}

export interface UseSubmitExtrinsic {
  uid: number;
  onSubmit: { (): void };
  submitting: boolean;
  proxySupported: boolean;
}
