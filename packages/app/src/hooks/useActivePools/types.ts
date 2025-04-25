// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  DetailActivePool,
  MaybeAddress,
  Nominations,
  PrevActivePool,
} from 'types'

export interface ActivePoolsProps {
  who: MaybeAddress
  onCallback?: (detail: DetailActivePool) => Promise<void>
}

export type ActivePoolsState = Record<string, PrevActivePool | null>

export type ActiveNominationsState = Record<string, Nominations>
