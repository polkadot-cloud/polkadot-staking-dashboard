// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UnsafeTransaction } from 'polkadot-api';
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
  onSubmit: () => void;
  submitting: boolean;
  proxySupported: boolean;
  submitAddress: MaybeAddress;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnsafeTx = UnsafeTransaction<any, string, string, any>;
