// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps } from '../types';

/**
 * @typedef {Object} ButtonOptionProps
 * @description Props for the ButtonOption component.
 * @param {ButtonOptionProps} props - The properties used to configure the ButtonOption component.
 * @param {React.ReactNode} [props.children] - Optional child elements to render inside the button,
 * typically additional content or nested components.
 * @param {string | undefined} [props.className] - Additional custom class names to apply to the
 * button for further styling.
 * @param {React.CSSProperties | undefined} [props.style] - Inline styles for applying custom styles
 * directly.
 * @param {boolean} [props.disabled=false] - If true, the button is disabled and cannot be
 * interacted with.
 * @param {string | undefined} [props.content] - Optional content used to modify the button's
 * behavior or style when present.
 * @param {() => void} [props.onClick] - Callback function to handle button click events.
 * @param {() => void} [props.onMouseOver] - Callback function to handle mouse over events.
 * @param {() => void} [props.onMouseMove] - Callback function to handle mouse move events.
 * @param {() => void} [props.onMouseOut] - Callback function to handle mouse out events.
 */
export type ButtonOptionProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    content?: boolean;
  };
