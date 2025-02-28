// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { FastUnstakeContextInterface, MetaInterface } from './types';

export const defaultMeta: MetaInterface = {
  checked: [],
};

export const defaultFastUnstakeContext: FastUnstakeContextInterface = {
  getLocalkey: (address) => '',
  checking: false,
  meta: defaultMeta,
  isExposed: null,
  queueDeposit: null,
  head: null,
  counterForQueue: null,
};
