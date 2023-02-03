// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

export interface TimeleftDuration {
  months: number;
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
  formatted: TimeLeftFormatted;
}

export interface TimeleftHookProps {
  refreshInterval: number;
}
