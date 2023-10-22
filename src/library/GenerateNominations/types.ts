// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'contexts/Validators/types';
import type { AnyFunction, DisplayFor } from 'types';

export interface GenerateNominationsProps {
  setters: AnyFunction[];
  nominations: NominationSelection;
  displayFor?: DisplayFor;
}

export type NominationSelectionWithResetCounter = NominationSelection & {
  reset: number;
};

export interface NominationSelection {
  nominations: Validator[];
}

export type AddNominationsType =
  | 'High Performance Validator'
  | 'Active Validator'
  | 'Random Validator';
