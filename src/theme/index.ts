// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import theme from 'styled-theming';
import { defaultThemes } from './default';

/* Aggregates all theme configurations and serves the currently
 * active mode via the theming context.
 */
const v = 'mode';

export const backgroundDropdown: theme.ThemeSet = theme(
  v,
  defaultThemes.background.dropdown
);

export const backgroundModalItem: theme.ThemeSet = theme(
  v,
  defaultThemes.background.modalitem
);

// highlights

export const highlightPrimary: theme.ThemeSet = theme(
  v,
  defaultThemes.highlight.primary
);

export const highlightSecondary: theme.ThemeSet = theme(
  v,
  defaultThemes.highlight.secondary
);

// buttons

export const buttonPrimaryBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.primary.background
);

export const buttonSecondaryBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.secondary.background
);

export const backgroundToggle: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.toggle.background
);

export const backgroundSubmission: theme.ThemeSet = theme(
  v,
  defaultThemes.background.submission
);

export const buttonHelpBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.help.background
);

export const buttonHoverBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.hover.background
);

// graphs

export const tooltipBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.graphs.tooltip
);
