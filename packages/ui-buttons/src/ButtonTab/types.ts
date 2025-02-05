// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types'
import type { ButtonCommonProps } from '../types'

export type ButtonTabProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    colorSecondary?: boolean
    active?: boolean
    title: string
    badge?: string | number
  }
