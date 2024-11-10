// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps } from '../types';

/**
 * @typedef {Object} ButtonPrimaryProps
 * @description Props for the ButtonPrimary component.
 * @property {ButtonHelpProps} props - The properties for configuring the ButtonHelp component.
 * @property {boolean} [props.disabled=false] - If true, the button is disabled and cannot be
 * clicked.
 * @property {boolean} [props.marginLeft=false] - If true, applies a left margin to the button.
 * @property {boolean} [props.marginRight=false] - If true, applies a right margin to the button.
 * @property {boolean} [props.marginX=false] - If true, applies horizontal margins to the button.
 * @property {string} [props.className] - Additional custom class names to apply to the button.
 * @property {React.CSSProperties} [props.style] - Inline styles for custom styling of the button.
 * @property {() => void} [props.onClick] - Callback function to handle button click events.
 * @property {() => void} [props.onMouseOver] - Callback function to handle mouse over events.
 * @property {() => void} [props.onMouseMove] - Callback function to handle mouse move events.
 * @property {() => void} [props.onMouseOut] - Callback function to handle mouse out events.
 * @property {boolean} [props.outline=false] - If true, applies an outline style to the button.
 * @property {'primary' | 'secondary' | 'none'} [props.background='primary'] - Sets the background
 * style of the button; can be 'primary', 'secondary', or 'none'.
 */
export type ButtonHelpProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    background?: 'primary' | 'secondary' | 'none';
    outline?: boolean;
  };
