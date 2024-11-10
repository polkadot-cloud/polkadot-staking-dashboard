// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface TimeleftDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  lastMinute: boolean;
}

export interface TimeLeftRaw {
  days: number;
  hours: number;
  minutes: number;
  seconds?: number;
}

export interface TimeLeftFormatted {
  days: [number, string];
  hours: [number, string];
  minutes: [number, string];
  seconds?: [number, string];
}

export interface TimeLeftAll {
  raw: TimeLeftRaw;
}

export interface TimeleftHookProps {
  refreshInterval: number;
}
