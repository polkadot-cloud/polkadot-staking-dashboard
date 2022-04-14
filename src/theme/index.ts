// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import theme from 'styled-theming';
import { defaultThemes } from './default';

/* Aggregates all theme configurations and serves the currently
 * active mode via the theming context.
 */
let v = 'mode';

// text colors

export const textPrimary: theme.ThemeSet = theme(v, defaultThemes.text.primary);

export const textSecondary: theme.ThemeSet = theme(v, defaultThemes.text.secondary);

export const textInvert: theme.ThemeSet = theme(v, defaultThemes.text.invert);

export const textDanger: theme.ThemeSet = theme(v, defaultThemes.text.danger);

// background colors

export const backgroundPrimary: theme.ThemeSet = theme(v, defaultThemes.background.primary);

export const backgroundSecondary: theme.ThemeSet = theme(v, defaultThemes.background.secondary);

export const backgroundGradient: theme.ThemeSet = theme(v, defaultThemes.background.gradient);

export const backgroundNetworkBar: theme.ThemeSet = theme(v, defaultThemes.background.network);

export const backgroundDropdown: theme.ThemeSet = theme(v, defaultThemes.background.dropdown);

export const backgroundValidator: theme.ThemeSet = theme(v, defaultThemes.background.validator);

export const backgroundAnnouncement: theme.ThemeSet = theme(v, defaultThemes.background.announcement);

export const backgroundToggle: theme.ThemeSet = theme(v, defaultThemes.buttons.toggle.background);

// highlights

export const highlightPrimary: theme.ThemeSet = theme(v, defaultThemes.highlight.primary);

export const highlightSecondary: theme.ThemeSet = theme(v, defaultThemes.highlight.secondary);

// buttons

export const buttonPrimaryBackground: theme.ThemeSet = theme(v, defaultThemes.buttons.primary.background);

// labels

export const labelBackground: theme.ThemeSet = theme(v, defaultThemes.background.label);

// borders

export const borderPrimary: theme.ThemeSet = theme(v, defaultThemes.border.primary);
