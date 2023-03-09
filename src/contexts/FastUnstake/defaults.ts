// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FastUnstakeContextInterface, MetaInterface } from './types';

export const defaultMeta: MetaInterface = {
  checked: [],
};

export const defaultFastUnstakeContext: FastUnstakeContextInterface = {
  // eslint-disable-next-line
  getLocalkey: (a) => '',
  checking: false,
  meta: defaultMeta,
  isExposed: null,
  queueDeposit: null,
  head: null,
  counterForQueue: null,
};
