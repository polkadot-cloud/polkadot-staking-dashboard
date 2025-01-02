// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Detect if an event is a CustomEvent by checking if it has a `detail` property
export const isCustomEvent = (event: Event): event is CustomEvent =>
  'detail' in event
