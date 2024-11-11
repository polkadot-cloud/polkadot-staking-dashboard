// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @name ButtonTertiary
 * @description A tertiary button component designed for use in less prominent actions or options
 * within the user interface.
 *
 * @param {ButtonTertiaryProps} props - The properties used to configure the ButtonTertiary
 * component.
 * @param {boolean} [props.disabled=false] - If true, the button is disabled, making it
 * non-interactive.
 * @param {boolean} [props.grow=false] - If true, allows the button to expand to fill available
 * space.
 * @param {string | undefined} [props.iconLeft] - Optional FontAwesome icon displayed on the left
 * side of the button text.
 * @param {string | undefined} [props.iconRight] - Optional FontAwesome icon displayed on the right
 * side of the button text.
 * @param {string | undefined} [props.iconTransform] - Optional transformation rules for the
 * FontAwesome icons (e.g., size or rotation).
 * @param {boolean} [props.marginLeft=false] - If true, applies left margin spacing to the button.
 * @param {boolean} [props.marginRight=false] - If true, applies right margin spacing to the button.
 * @param {boolean} [props.marginX=false] - If true, applies horizontal margin spacing to the
 * button.
 * @param {string | undefined} [props.className] - Additional custom class names to apply to the
 * button for extended styling options.
 * @param {React.CSSProperties | undefined} [props.style] - Inline styles for applying custom styles
 * directly to the button.
 * @param {string} [props.text] - The text content to be displayed within the button.
 * @param {() => void} [props.onClick] - Callback function to handle button click events.
 * @param {() => void} [props.onMouseOver] - Callback function to handle mouse over events.
 * @param {() => void} [props.onMouseMove] - Callback function to handle mouse move events.
 * @param {() => void} [props.onMouseOut] - Callback function to handle mouse out events.
 *
 * @returns {JSX.Element} The rendered ButtonTertiary component, styled and configured based on the
 * provided props, with optional icon and text content.
 */
export type ButtonTertiaryProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string;
  };
