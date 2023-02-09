// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import theme from 'styled-theming';
import { defaultThemes } from './default';

/* Aggregates all theme configurations and serves the currently
 * active mode via the theming context.
 */
const v = 'mode';

// background colors
export const backgroundPrimary: theme.ThemeSet = theme(
  v,
  defaultThemes.background.primary
);

export const backgroundSecondary: theme.ThemeSet = theme(
  v,
  defaultThemes.background.secondary
);

export const backgroundGradient: theme.ThemeSet = theme(
  v,
  defaultThemes.background.gradient
);

export const backgroundNetworkBar: theme.ThemeSet = theme(
  v,
  defaultThemes.background.network
);

export const backgroundDropdown: theme.ThemeSet = theme(
  v,
  defaultThemes.background.dropdown
);

export const backgroundModalItem: theme.ThemeSet = theme(
  v,
  defaultThemes.background.modalitem
);

export const backgroundValidator: theme.ThemeSet = theme(
  v,
  defaultThemes.background.validator
);

export const backgroundLabel: theme.ThemeSet = theme(
  v,
  defaultThemes.background.label
);

export const backgroundIdenticon: theme.ThemeSet = theme(
  v,
  defaultThemes.background.identicon
);

export const backgroundOverlay: theme.ThemeSet = theme(
  v,
  defaultThemes.background.overlay
);

export const backgroundWarning: theme.ThemeSet = theme(
  v,
  defaultThemes.background.warning
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

export const buttonDisabledBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.disabled.background
);

export const buttonDisabledText: theme.ThemeSet = theme(
  v,
  defaultThemes.buttons.disabled.text
);

// labels

export const tagBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.background.tag
);

// graphs

export const tooltipBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.graphs.tooltip
);

export const gridColor: theme.ThemeSet = theme(v, defaultThemes.graphs.grid);
