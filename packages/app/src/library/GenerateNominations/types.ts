// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, DisplayFor } from '@w3ux/types'
import type { Validator } from 'contexts/Validators/types'

export interface GenerateNominationsProps {
  setters: AnyFunction[]
  nominations: NominationSelection
  displayFor?: DisplayFor
  allowRevert?: boolean
}

export type NominationSelectionWithResetCounter = NominationSelection & {
  reset: number
}

export interface NominationSelection {
  nominations: Validator[]
}

export type AddNominationsType =
  | 'High Performance Validator'
  | 'Active Validator'
  | 'Random Validator'
