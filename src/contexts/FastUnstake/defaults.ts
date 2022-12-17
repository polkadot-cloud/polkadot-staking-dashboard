// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FastUnstakeContextInterface, MetaInterface } from './types';

export const defaultMeta: MetaInterface = {
  currentEra: null,
  checked: [],
};

export const defaultFastUnstakeContext: FastUnstakeContextInterface = {
  checking: false,
  meta: defaultMeta,
  isExposed: null,
  queueStatus: null,
  counterForQueue: null,
};
