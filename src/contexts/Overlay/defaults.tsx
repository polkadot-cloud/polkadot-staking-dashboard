// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { OverlayContextInterface } from './types';

export const defaultOverlayContext: OverlayContextInterface = {
  status: 'closed',
  setStatus: () => {},
  openOverlay: (type, config) => {},
  modal: {
    config: {},
    height: 0,
    resize: 0,
    maxHeight: 0,
    setResize: () => {},
    setHeight: () => {},
    setRef: (ref) => {},
    setHeightRef: (height) => {},
    replaceWith: (config) => {},
    openWith: (config) => {},
  },
};
