// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @name ButtonTertiary
 * @description A tertiary button component designed for use in less prominent actions or options
 * within the user interface.
 *
 * component.
 * @property {boolean} [disabled=false] - If true, the button is disabled, making it
 * non-interactive.
 * @property {boolean} [grow=false] - If true, allows the button to expand to fill available space.
 * @property {string | undefined} [iconLeft] - Optional FontAwesome icon displayed on the left side
 * of the button text.
 * @property {string | undefined} [iconRight] - Optional FontAwesome icon displayed on the right
 * side of the button text.
 * @property {string | undefined} [iconTransform] - Optional transformation rules for the
 * FontAwesome icons (e.g., size or rotation).
 * @property {boolean} [marginLeft=false] - If true, applies left margin spacing to the button.
 * @property {boolean} [marginRight=false] - If true, applies right margin spacing to the button.
 * @property {boolean} [marginX=false] - If true, applies horizontal margin spacing to the button.
 * @property {string | undefined} [className] - Additional custom class names to apply to the button
 * for extended styling options.
 * @property {React.CSSProperties | undefined} [style] - Inline styles for applying custom styles
 * directly to the button.
 * @property {string} [text] - The text content to be displayed within the button.
 * @property {() => void} [onClick] - Callback function to handle button click events.
 * @property {() => void} [onMouseOver] - Callback function to handle mouse over events.
 * @property {() => void} [onMouseMove] - Callback function to handle mouse move events.
 * @property {() => void} [onMouseOut] - Callback function to handle mouse out events.
 *
 * @returns {JSX.Element} The rendered ButtonTertiary component, styled and configured based on the
 * provided  with optional icon and text content.
 */
export type ButtonTertiaryProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string;
  };
