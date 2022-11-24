// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TipsContextInterface } from './types';

export const defaultTipsContext: TipsContextInterface = {
  // eslint-disable-next-line
  openTipWith: (d, c) => {},
  closeTip: () => {},
  // eslint-disable-next-line
  setStatus: (s) => {},
  // eslint-disable-next-line
  setTip: (d) => {},
  // eslint-disable-next-line
  toggleDismiss: (o) => {},
  dismissOpen: false,
  status: 0,
  tip: null,
};
