// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types'
import type { ButtonCommonProps, ButtonIconProps } from '../types'

export type ButtonPrimaryInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    // use secondary network color.
    colorSecondary?: boolean
    // large button, small otherwise.
    lg?: boolean
    // button text.
    text: string
  }
