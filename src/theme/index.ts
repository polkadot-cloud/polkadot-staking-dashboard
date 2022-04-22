// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import theme from 'styled-theming';
import { defaultThemes } from './default';

/* Aggregates all theme configurations and serves the currently
 * active mode via the theming context.
 */
let v = 'mode';

// main theme colors

export const primary: theme.ThemeSet = theme(v, defaultThemes.primary);

export const secondary: theme.ThemeSet = theme(v, defaultThemes.secondary);

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

export const backgroundLabel: theme.ThemeSet = theme(v, defaultThemes.background.label);

export const backgroundIdenticon: theme.ThemeSet = theme(v, defaultThemes.background.identicon);

export const backgroundOverlay: theme.ThemeSet = theme(v, defaultThemes.background.overlay);

// highlights

export const highlightPrimary: theme.ThemeSet = theme(v, defaultThemes.highlight.primary);

export const highlightSecondary: theme.ThemeSet = theme(v, defaultThemes.highlight.secondary);

// buttons

export const buttonPrimaryBackground: theme.ThemeSet = theme(v, defaultThemes.buttons.primary.background);

export const buttonSecondaryBackground: theme.ThemeSet = theme(v, defaultThemes.buttons.secondary.background);

export const backgroundToggle: theme.ThemeSet = theme(v, defaultThemes.buttons.toggle.background);

export const buttonAssistantBackground: theme.ThemeSet = theme(v, defaultThemes.buttons.assistant.background);


// labels

export const tagBackground: theme.ThemeSet = theme(v, defaultThemes.background.tag);

// graphs

export const tooltipBackground: theme.ThemeSet = theme(v, defaultThemes.graphs.tooltip);

export const gridColor: theme.ThemeSet = theme(v, defaultThemes.graphs.grid);


// borders

export const borderPrimary: theme.ThemeSet = theme(v, defaultThemes.border.primary);

// modal

export const modalOverlayBackground: theme.ThemeSet = theme(v, defaultThemes.modal.overlay);

export const modalBackground: theme.ThemeSet = theme(v, defaultThemes.modal.background);

// assistant

export const assistantBackground: theme.ThemeSet = theme(v, defaultThemes.assistant.background);

export const assistantButton: theme.ThemeSet = theme(v, defaultThemes.assistant.button.background);

export const assistantLink: theme.ThemeSet = theme(v, defaultThemes.assistant.link);