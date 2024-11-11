// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @name {Object} ButtonPrimaryInvertProps
 * @description Props for the ButtonPrimaryInvert component.
 * @property {string | undefined} [className] - Additional custom class name(s) to apply to the
 * button.
 * @property {boolean} [colorSecondary=false] - If true, use the secondary network color for the
 * button.
 * @property {boolean} [disabled=false] - If true, the button is disabled.
 * @property {boolean} [grow=false] - If true, the button will have a grow effect (e.g., for
 * flex-based layouts).
 * @property {string | undefined} [iconLeft] - An optional FontAwesome icon to display on the left
 * side of the button text.
 * @property {string | undefined} [iconRight] - An optional FontAwesome icon to display on the right
 * side of the button text.
 * @property {string | undefined} [iconTransform] - Optional transformation rules for the
 * FontAwesome icons (e.g., size or rotation).
 * @property {boolean} [lg=false] - If true, renders the button as a large button; otherwise, it
 * defaults to a small button.
 * @property {boolean} [marginLeft=false] - If true, applies a left margin utility class to the
 * button.
 * @property {boolean} [marginRight=false] - If true, applies a right margin utility class to the
 * button.
 * @property {boolean} [marginX=false] - If true, applies horizontal margin utility classes to the
 * button.
 * @property {() => void} [onClick] - Callback function to handle button click events.
 * @property {() => void} [onMouseMove] - Callback function to handle mouse move events.
 * @property {() => void} [onMouseOut] - Callback function to handle mouse out events.
 * @property {() => void} [onMouseOver] - Callback function to handle mouse over events.
 * @property {React.CSSProperties | undefined} [style] - Inline styles to apply to the button.
 * @property {string} text - The text label to display within the button.
 */
export type ButtonPrimaryInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    // use secondary network color.
    colorSecondary?: boolean;
    // large button, small otherwise.
    lg?: boolean;
    // button text.
    text: string;
  };
