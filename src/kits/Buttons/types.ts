// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  IconDefinition,
  IconProp,
} from '@fortawesome/fontawesome-svg-core';
import type { MouseEvent } from 'react';

export type ButtonType =
  | 'help'
  | 'mono'
  | 'monoInvert'
  | 'option'
  | 'primary'
  | 'primaryInvert'
  | 'secondary'
  | 'submit'
  | 'submitInvert'
  | 'tab'
  | 'tertiary'
  | 'text';

// Common button props, applied to all buttons.
export interface ButtonCommonProps {
  // whether the button is disabled.
  disabled?: boolean;
  // include a left margin
  marginLeft?: boolean;
  // include a right margin.
  marginRight?: boolean;
  // include x margin around button.
  marginX?: boolean;
  // enable flex grow.
  grow?: boolean;
  // onClick handler of button.
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  // onMouseOver handler of button.
  onMouseOver?: (e?: MouseEvent<HTMLButtonElement>) => void;
  // onMouseMove handler of button.
  onMouseMove?: (e?: MouseEvent<HTMLButtonElement>) => void;
  // onMouseOut handler of button.
  onMouseOut?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

// Icon support for buttons.
export interface ButtonIconProps {
  // include a left icon with the button.
  iconLeft?: IconProp | IconDefinition;
  // include a right icon with the button.
  iconRight?: IconProp | IconDefinition;
  // transform icon size.
  iconTransform?: string;
}
