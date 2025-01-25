// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, DisplayFor } from '@w3ux/types'
import type { ValidatorEraPoints } from 'plugin-staking-api/types'
import type { FormEvent } from 'react'

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

export interface PulseProps {
  address: string
  displayFor: DisplayFor
  eraPoints: ValidatorEraPoints[]
}
export interface GraphInnerProps {
  points: number[]
  syncing: boolean
  displayFor: DisplayFor
}
