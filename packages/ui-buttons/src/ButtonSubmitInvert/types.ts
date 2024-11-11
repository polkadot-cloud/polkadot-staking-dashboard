// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @name {Object} ButtonSubmitInvertProps
 * @description Props for the ButtonSubmitInvert component.
 *
 *component.
 * @property {boolean} [disabled=false] - If true, the button is disabled, preventing user
 *interaction.
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
 * @property {string} [text] - Text content displayed within the button.
 * @property {boolean} [lg=false] - If true, renders the button as a large button; otherwise, it
 * defaults to a smaller size.
 * @property {() => void} [onClick] - Callback function triggered on button click events.
 * @property {() => void} [onMouseOver] - Callback function triggered on mouse over events.
 * @property {() => void} [onMouseMove] - Callback function triggered on mouse move events.
 * @property {() => void} [onMouseOut] - Callback function triggered on mouse out events.
 *
 * @returns {JSX.Element} The rendered ButtonSubmitInvert component, styled and configured based on
 * the provided  with optional icon and text content.
 */
export type ButtonSubmitInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string;
    lg?: boolean;
  };
