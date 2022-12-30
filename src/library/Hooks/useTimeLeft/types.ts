// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors

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
  formatted: TimeLeftFormatted;
}

export type TimeleftProps = number;
