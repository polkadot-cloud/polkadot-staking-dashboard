// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps } from '../types';

/**
 * @typedef {Object} ButtonTabProps
 * @description A tab-style button component used to represent selectable tabs within an interface.
 * This component supports active states, badges for additional information, and customizable styles
 * and event handling, making it suitable for interactive tab navigation or selection.
 *
 * @param {ButtonTabProps} props - The properties used to configure the ButtonTab component.
 * @param {boolean} [props.disabled=false] - If true, the button is disabled and cannot be
 * interacted with.
 * @property {boolean} [colorSecondary=false] - If true, use the secondary network color for the
 * button.
 * @param {string | undefined} [props.className] - Additional custom class names to apply to the
 * button for extended styling options.
 * @param {React.CSSProperties | undefined} [props.style] - Inline styles for applying custom styles
 * directly to the button.
 * @param {boolean} [props.active=false] - If true, applies an active state style to the button.
 * @param {string} [props.title] - The text content to be displayed within the button.
 * @param {string | number | undefined} [props.badge] - Optional badge content to display alongside
 * the title.
 * @param {() => void} [props.onClick] - Callback function to handle button click events.
 * @param {() => void} [props.onMouseOver] - Callback function to handle mouse over events.
 * @param {() => void} [props.onMouseMove] - Callback function to handle mouse move events.
 * @param {() => void} [props.onMouseOut] - Callback function to handle mouse out events.
 *
 * @returns {JSX.Element} The rendered ButtonTab component, styled and configured based on the
 * provided props, with support for optional title and badge content.
 */
export type ButtonTabProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    colorSecondary?: boolean;
    active?: boolean;
    title: string;
    badge?: string | number;
  };
