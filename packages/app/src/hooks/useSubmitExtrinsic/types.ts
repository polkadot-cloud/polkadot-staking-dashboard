// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi, MaybeAddress } from 'types';

export interface UseSubmitExtrinsicProps {
  tx: AnyApi;
  tag?: string;
  from: MaybeAddress;
  shouldSubmit: boolean;
  callbackSubmit?: () => void;
  callbackInBlock?: () => void;
}

export interface UseSubmitExtrinsic {
  uid: number;
  onSubmit: () => void;
  proxySupported: boolean;
  submitAddress: MaybeAddress;
}

export type UnsafeTx = AnyApi;
