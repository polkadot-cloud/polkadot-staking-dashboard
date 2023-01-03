// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TimeleftDuration, TimeleftHookProps } from './types';

export const defaultDuration: TimeleftDuration = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  lastMinute: false,
};

export const TimeleftHook: TimeleftHookProps = {
  refreshCallback: () => 0,
  refreshInterval: 60,
};
