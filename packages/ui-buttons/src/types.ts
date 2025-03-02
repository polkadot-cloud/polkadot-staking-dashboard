// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  IconDefinition,
  IconProp,
} from '@fortawesome/fontawesome-svg-core'
import type {
  ComponentBase,
  ComponentBaseWithClassName,
  ImportedAccount,
} from '@w3ux/types'
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

export type ButtonSize = 'sm' | 'md' | 'lg'

// Button mouse event handler props.
export interface OnMouseHandlersProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseOver?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseMove?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseOut?: (e: MouseEvent<HTMLButtonElement>) => void
}

export interface ButtonIconProps {
  iconLeft?: IconProp | IconDefinition
  iconRight?: IconProp | IconDefinition
  iconTransform?: string
}

export interface ButtonCopyProps {
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
  value: string
  size?: string | number
  portalContainer?: HTMLDivElement
  xMargin?: boolean
  tooltipText: {
    copy: string
    copied: string
  }
}

export type ButtonHelpProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    background?: 'primary' | 'secondary' | 'none'
    outline?: boolean
  }

export type ButtonMonoProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    lg?: boolean
    text: string
  }

export type ButtonMonoInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    lg?: boolean
    text: string
  }

export type ButtonOptionProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    content?: boolean
  }

export type ButtonPrimaryProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    colorSecondary?: boolean
    size?: ButtonSize
    text: string
  }

export type ButtonPrimaryInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    colorSecondary?: boolean
    lg?: boolean
    text: string
  }

export type ButtonSecondaryProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    lg?: boolean
    text: string
  }

export type ButtonSubmitProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    colorSecondary?: boolean
    text: string
    lg?: boolean
    pulse?: boolean
  }

export type ButtonSubmitInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string
    lg?: boolean
  }

export type ButtonTabProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    colorSecondary?: boolean
    active?: boolean
    title: string
    badge?: string | number
  }

export type ButtonTertiaryProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string
  }

export type ButtonTextProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string
    size?: Omit<ButtonSize, 'lg'>
    status?: 'danger'
  }

export type MultiButtonContainerProps = ComponentBase & {
  marginLeft?: boolean
  marginRight?: boolean
  marginX?: boolean
  disabled?: boolean
}

export type MultiButtonButtonProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string
    size?: Omit<ButtonSize, 'lg'>
  }

export type ButtonHeaderProps = ComponentBase &
  OnMouseHandlersProps & {
    marginLeft?: boolean
    marginRight?: boolean
    marginX?: boolean
    disabled?: boolean
    icon: IconProp | IconDefinition
    iconTransform?: string
  }

export type ButtonAccountProps = ComponentBaseWithClassName & {
  activeAccount: ImportedAccount | null
  readOnly: boolean
  open: boolean
  activeProxy: ImportedAccount | null
  marginLeft?: boolean
  marginRight?: boolean
  marginX?: boolean
}

export type ButtonAccountInactiveProps = ComponentBaseWithClassName &
  OnMouseHandlersProps & {
    label: string
    marginLeft?: boolean
    marginRight?: boolean
    marginX?: boolean
    disabled?: boolean
  }
