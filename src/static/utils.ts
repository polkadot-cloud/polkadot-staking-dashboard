// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export const isCustomEvent = (event: Event): event is CustomEvent => {
  return 'detail' in event;
};
