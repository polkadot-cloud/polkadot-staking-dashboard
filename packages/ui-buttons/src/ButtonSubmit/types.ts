// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @typedef {Object} ButtonSubmitProps
 * @description Props for the ButtonSubmit component.
 * @param {ButtonSubmitProps} props - The properties used to configure the ButtonSubmit component.
 * @param {boolean} [props.colorSecondary=false] - If true, applies a secondary color style to the
 * button.
 * @param {boolean} [props.disabled=false] - If true, the button is disabled and cannot be
 * interacted with.
 * @param {boolean} [props.grow=false] - If true, makes the button grow to fill available space.
 * @param {string | undefined} [props.iconLeft] - Optional FontAwesome icon to display on the left
 * side of the button text.
 * @param {string | undefined} [props.iconRight] - Optional FontAwesome icon to display on the right
 * side of the button text.
 * @param {string | undefined} [props.iconTransform] - Optional transformation rules for the
 * FontAwesome icons.
 * @param {boolean} [props.marginLeft=false] - If true, applies left margin spacing to the button.
 * @param {boolean} [props.marginRight=false] - If true, applies right margin spacing to the button.
 * @param {boolean} [props.marginX=false] - If true, applies horizontal margin spacing to the
 * button.
 * @param {string | undefined} [props.className] - Additional custom class names to apply to the
 * button for further styling.
 * @param {React.CSSProperties | undefined} [props.style] - Inline styles for applying custom styles
 * directly.
 * @param {string} [props.text] - The text to be displayed within the button.
 * @param {boolean} [props.lg=false] - If true, renders the button as a large button; otherwise, it
 * defaults to a smaller size.
 * @param {boolean} [props.pulse=false] - If true, applies a pulse animation style to the button for
 * emphasis.
 * @param {() => void} [props.onClick] - Callback function to handle button click events.
 * @param {() => void} [props.onMouseOver] - Callback function to handle mouse over events.
 * @param {() => void} [props.onMouseMove] - Callback function to handle mouse move events.
 * @param {() => void} [props.onMouseOut] - Callback function to handle mouse out events.
 */
export type ButtonSubmitProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    colorSecondary?: boolean;
    text: string;
    lg?: boolean;
    pulse?: boolean;
  };
