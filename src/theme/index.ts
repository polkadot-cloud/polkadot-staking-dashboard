// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import theme from 'styled-theming';
import { defaultThemes } from './default';

/* Aggregates all theme configurations and serves the currently
 * active mode via the theming context.
 */
const v = 'mode';

// graphs

export const tooltipBackground: theme.ThemeSet = theme(
  v,
  defaultThemes.graphs.tooltip
);
