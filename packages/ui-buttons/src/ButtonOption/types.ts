// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps } from '../types';

/**
 * @name {Object} ButtonOptionProps
 * @description Props for the ButtonOption component.
 * @property {React.ReactNode} [children] - Optional child elements to render inside the button,
 * typically additional content or nested components.
 * @property {string | undefined} [className] - Additional custom class names to apply to the button
 * for further styling.
 * @property {React.CSSProperties | undefined} [style] - Inline styles for applying custom styles
 * directly.
 * @property {boolean} [disabled=false] - If true, the button is disabled and cannot be interacted
 * with.
 * @property {string | undefined} [content] - Optional content used to modify the button's behavior or
 * style when present.
 * @property {() => void} [onClick] - Callback function to handle button click events.
 * @property {() => void} [onMouseOver] - Callback function to handle mouse over events.
 * @property {() => void} [onMouseMove] - Callback function to handle mouse move events.
 * @property {() => void} [onMouseOut] - Callback function to handle mouse out events.
 */
export type ButtonOptionProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    content?: boolean;
  };
