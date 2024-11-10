// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TimeleftDuration } from './types';

export const defaultDuration: TimeleftDuration = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  lastMinute: false,
};

export const defaultRefreshInterval = 60;
