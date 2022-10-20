// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TipsContextInterface } from './types';

export const defaultTipsContext: TipsContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openTipWith: (d, c) => {},
  closeTip: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStatus: (s) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTip: (d) => {},
  status: 0,
  tip: null,
};
