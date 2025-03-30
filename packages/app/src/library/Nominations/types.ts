// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { ListFormat } from 'contexts/List/types'
import type { Validator } from 'types'

export interface ManageNominationsInterface {
  addToSelected: (item: AnyJson) => void
  removeFromSelected: (item: AnyJson) => void
  setListFormat: (format: ListFormat) => void
  resetSelected: () => void
  selected: Validator[]
  listFormat: ListFormat
  selectTogglable: boolean
}
