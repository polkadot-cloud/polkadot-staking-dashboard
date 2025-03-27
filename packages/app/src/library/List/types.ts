// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DisplayFor } from '@w3ux/types'
import type { ValidatorEraPoints } from 'plugin-staking-api/types'
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

export interface EraPointsHistoricalProps {
  address: string
  displayFor: DisplayFor
  eraPoints: ValidatorEraPoints[]
}

export interface EraPointsGraphInnerProps {
  points: number[]
  syncing: boolean
  displayFor: DisplayFor
}

export interface CurrentEraPointsProps {
  address: string
  displayFor: DisplayFor
}

export interface IdentityDisplay {
  node: ReactNode
  data: Record<string, string> | null
}
