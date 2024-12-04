// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, DisplayFor } from '@w3ux/types'
import type { ListFormat } from 'library/PoolList/types'
import type { FormEvent, ReactNode } from 'react'

export interface PaginationWrapperProps {
  $next: boolean
  $prev: boolean
}

export interface ListProps {
  $flexBasisLarge: string
}

export interface PaginationProps {
  page: number
  total: number
  disabled?: boolean
  setter: (p: number) => void
}

export interface SearchInputProps {
  value: string
  handleChange: (e: FormEvent<HTMLInputElement>) => void
  placeholder: string
}

export interface SelectableProps {
  actionsAll: AnyJson[]
  actionsSelected: AnyJson[]
  canSelect: boolean
  displayFor: DisplayFor
}

export interface ListContextInterface {
  setSelectActive: (selectedActive: boolean) => void
  addToSelected: (item: AnyJson) => void
  removeFromSelected: (items: AnyJson[]) => void
  resetSelected: () => void
  setListFormat: (v: ListFormat) => void
  selected: AnyJson[]
  selectActive: boolean
  listFormat: ListFormat
  selectToggleable: boolean
}

export interface ListProviderProps {
  selectToggleable?: boolean
  selectActive?: boolean
  children: ReactNode
}
