// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @name {Object} ButtonMonoInvertProps
 * @description Props for the ButtonMonoInvert component.
 * @property {boolean} [disabled=false] - If true, the button is disabled and cannot be interacted
 * with.
 * @property {boolean} [grow=false] - If true, the button will expand to fill available space.
 * @property {string | undefined} [iconLeft] - Optional FontAwesome icon to display on the left side
 * of the button text.
 * @property {string | undefined} [iconRight] - Optional FontAwesome icon to display on the right
 * side of the button text.
 * @property {string | undefined} [iconTransform] - Optional transformation rules for the
 * FontAwesome icons.
 * @property {boolean} [lg=false] - If true, the button is rendered as a large button; otherwise, it
 * defaults to a small button.
 * @property {boolean} [marginLeft=false] - If true, applies left margin spacing to the button.
 * @property {boolean} [marginRight=false] - If true, applies right margin spacing to the button.
 * @property {boolean} [marginX=false] - If true, applies horizontal margin spacing to the button.
 * @property {string | undefined} [className] - Additional custom class names to apply to the button
 * for further styling.
 * @property {React.CSSProperties | undefined} [style] - Inline styles for applying custom styles
 * directly.
 * @property {string} [text] - Text content to be displayed within the button.
 * @property {() => void} [onClick] - Callback function to handle button click events.
 * @property {() => void} [onMouseOver] - Callback function to handle mouse over events.
 * @property {() => void} [onMouseMove] - Callback function to handle mouse move events.
 * @property {() => void} [onMouseOut] - Callback function to handle mouse out events.
 */
export type ButtonMonoInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    lg?: boolean;
    text: string;
  };
