// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyApi, MaybeAccount } from 'types';

export interface UseSubmitExtrinsicProps {
  tx: AnyApi;
  shouldSubmit: boolean;
  callbackSubmit: { (): void };
  callbackInBlock: { (): void };
  callbackSuccess?: { (): void };
  callbackError?: { (): void };
  from: MaybeAccount;
}

export interface UseSubmitExtrinsic {
  submitTx: { (): void };
  submitting: boolean;
}
