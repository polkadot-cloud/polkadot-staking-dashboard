// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OverlayContextInterface } from './types';

export const defaultOverlayContext: OverlayContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openOverlayWith: (o) => {},
  closeOverlay: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStatus: (s) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverlay: (d) => {},
  status: 0,
  Overlay: null,
};
