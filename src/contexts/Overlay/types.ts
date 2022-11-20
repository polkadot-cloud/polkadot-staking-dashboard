// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { MaybeString } from 'types';

export interface OverlayContextInterface {
  openOverlayWith: (o: React.ReactNode | null) => void;
  closeOverlay: () => void;
  setStatus: (s: number) => void;
  setOverlay: (d: MaybeString) => void;
  status: number;
  Overlay: React.ReactNode | null;
}
