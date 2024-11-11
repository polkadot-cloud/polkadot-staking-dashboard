// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ButtonCommonProps } from '../types';

/**
 * @naem {Object} ButtonTabProps
 * @description A tab-style button component used to represent selectable tabs within an interface.
 * This component supports active states, badges for additional information, and customizable styles
 * and event handling, making it suitable for interactive tab navigation or selection.
 *
 * @property {boolean} [disabled=false] - If true, the button is disabled and cannot be interacted
 * with.
 * @property {boolean} [colorSecondary=false] - If true, use the secondary network color for the
 * button.
 * @property {string | undefined} [className] - Additional custom class names to apply to the button
 * for extended styling options.
 * @property {React.CSSProperties | undefined} [style] - Inline styles for applying custom styles
 * directly to the button.
 * @property {boolean} [active=false] - If true, applies an active state style to the button.
 * @property {string} [title] - The text content to be displayed within the button.
 * @property {string | number | undefined} [badge] - Optional badge content to display alongside the
 * title.
 * @property {() => void} [onClick] - Callback function to handle button click events.
 * @property {() => void} [onMouseOver] - Callback function to handle mouse over events.
 * @property {() => void} [onMouseMove] - Callback function to handle mouse move events.
 * @property {() => void} [onMouseOut] - Callback function to handle mouse out events.
 *
 * @returns {JSX.Element} The rendered ButtonTab component, styled and configured based on the
 * provided  with support for optional title and badge content.
 */
export type ButtonTabProps = ComponentBaseWithClassName &
  ButtonCommonProps & {
    colorSecondary?: boolean;
    active?: boolean;
    title: string;
    badge?: string | number;
  };
