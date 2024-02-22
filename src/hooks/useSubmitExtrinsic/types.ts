// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi, MaybeAddress } from 'types';

export interface UseSubmitExtrinsicProps {
  tx: AnyApi;
  from: MaybeAddress;
  shouldSubmit: boolean;
  callbackSubmit?: () => void;
  callbackInBlock?: () => void;
}

export interface UseSubmitExtrinsic {
  uid: number;
  onSubmit: (customEventInBlock?: string) => void;
  submitting: boolean;
  proxySupported: boolean;
  submitAddress: MaybeAddress;
}
