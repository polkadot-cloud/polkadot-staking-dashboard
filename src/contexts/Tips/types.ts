// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeString } from 'types';

export interface TipsContextInterface {
  openTipWith: (d: MaybeString, c: any) => void;
  closeTip: () => void;
  setStatus: (s: number) => void;
  setTip: (d: MaybeString) => void;
  status: number;
  tip: MaybeString;
}
