// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps, ButtonIconProps } from '../types';

/**
 * @typedef {Object} ButtonSubmitInvertProps
 * @description Props for the ButtonSubmitInvert component.
 *
 * @param {ButtonSubmitInvertProps} props - The properties used to configure the ButtonSubmitInvert
 *component.
 * @param {boolean} [props.disabled=false] - If true, the button is disabled, preventing user
 *interaction.
 * @param {boolean} [props.grow=false] - If true, allows the button to expand to fill available
 *space.
 * @param {string | undefined} [props.iconLeft] - Optional FontAwesome icon displayed on the left
 * side of the button text.
 * @param {string | undefined} [props.iconRight] - Optional FontAwesome icon displayed on the right
 * side of the button text.
 * @param {string | undefined} [props.iconTransform] - Optional transformation rules for the
 * FontAwesome icons (e.g., size or rotation).
 * @param {boolean} [props.marginLeft=false] - If true, applies left margin spacing to the button.
 * @param {boolean} [props.marginRight=false] - If true, applies right margin spacing to the button.
 * @param {boolean} [props.marginX=false] - If true, applies horizontal margin spacing to the button.
 * @param {string | undefined} [props.className] - Additional custom class names to apply to the
 * button for extended styling options.
 * @param {React.CSSProperties | undefined} [props.style] - Inline styles for applying custom styles
 * directly to the button.
 * @param {string} [props.text] - Text content displayed within the button.
 * @param {boolean} [props.lg=false] - If true, renders the button as a large button; otherwise, it
 * defaults to a smaller size.
 * @param {() => void} [props.onClick] - Callback function triggered on button click events.
 * @param {() => void} [props.onMouseOver] - Callback function triggered on mouse over events.
 * @param {() => void} [props.onMouseMove] - Callback function triggered on mouse move events.
 * @param {() => void} [props.onMouseOut] - Callback function triggered on mouse out events.
 *
 * @returns {JSX.Element} The rendered ButtonSubmitInvert component, styled and configured based on
 * the provided props, with optional icon and text content.
 */
export type ButtonSubmitInvertProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    text: string;
    lg?: boolean;
  };
