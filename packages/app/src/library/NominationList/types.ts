// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DisplayFor } from '@w3ux/types'
import type { Validator, ValidatorListEntry } from 'contexts/Validators/types'
import type { ValidatorEraPoints } from 'plugin-staking-api/types'
import type { BondFor, MaybeAddress, NominationStatus } from 'types'

export interface NominationListProps {
  validators: Validator[]
  bondFor: BondFor
  generateMethod?: string
  nominator?: MaybeAddress
  allowFilters?: boolean
  toggleFavorites?: boolean
  title?: string
  displayFor?: DisplayFor
}

export interface ItemProps {
  validator: ValidatorListEntry
  nominator: MaybeAddress
  bondFor: BondFor
  displayFor: DisplayFor
  toggleFavorites?: boolean
  nominationStatus?: NominationStatus
  eraPoints: ValidatorEraPoints[]
  showParaValidator?: boolean
}
