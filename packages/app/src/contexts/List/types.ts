// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

export type ListFormat = 'row' | 'col'

export interface ListContextInterface {
  addToSelected: (item: AnyJson) => void
  removeFromSelected: (items: AnyJson[]) => void
  resetSelected: () => void
  setListFormat: (v: ListFormat) => void
  selected: AnyJson[]
  selectable: boolean
  listFormat: ListFormat
  selectToggleable: boolean
  pagination: {
    page: number
    setPage: Dispatch<SetStateAction<number>>
  }
}

export interface ListProviderProps {
  selectToggleable?: boolean
  selectable?: boolean
  children: ReactNode
}
