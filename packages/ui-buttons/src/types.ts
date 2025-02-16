// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  IconDefinition,
  IconProp,
} from '@fortawesome/fontawesome-svg-core'
import type { ComponentBase } from '@w3ux/types'
import type { MouseEvent } from 'react'

// Common button props, applied to all buttons.
export interface ButtonCommonProps {
  // whether the button is disabled.
  disabled?: boolean
  // include a left margin
  marginLeft?: boolean
  // include a right margin.
  marginRight?: boolean
  // include x margin around button.
  marginX?: boolean
  // enable flex grow.
  grow?: boolean
  // onClick handler of button.
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
  // onMouseOver handler of button.
  onMouseOver?: (e?: MouseEvent<HTMLButtonElement>) => void
  // onMouseMove handler of button.
  onMouseMove?: (e?: MouseEvent<HTMLButtonElement>) => void
  // onMouseOut handler of button.
  onMouseOut?: (e?: MouseEvent<HTMLButtonElement>) => void
}

// Button mouse event handler props.
export interface OnMouseHandlersProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseOver?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseMove?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseOut?: (e: MouseEvent<HTMLButtonElement>) => void
}

// Button icon support.
export interface ButtonIconProps {
  // include a left icon with the button.
  iconLeft?: IconProp | IconDefinition
  // include a right icon with the button.
  iconRight?: IconProp | IconDefinition
  // transform icon size.
  iconTransform?: string
}

export type MultiButtonProps = ComponentBase & {
  marginLeft?: boolean
  marginRight?: boolean
  marginX?: boolean
  disabled?: boolean
}

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonCopyProps {
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
  value: string
  inheritSize?: boolean
  tooltipPortalContainer?: HTMLDivElement
}
