// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types'
import type { ButtonCommonProps, ButtonIconProps, ButtonSize } from '../types'

export type ButtonTextProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string
    size?: Omit<ButtonSize, 'lg'>
  }
