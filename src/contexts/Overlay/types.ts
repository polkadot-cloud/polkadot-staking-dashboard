// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeString } from 'types';

export interface OverlayContextInterface {
  openOverlayWith: (d: MaybeString, c: any) => void;
  closeOverlay: () => void;
  setStatus: (s: number) => void;
  setOverlay: (d: MaybeString) => void;
  status: number;
  overlay: MaybeString;
}
