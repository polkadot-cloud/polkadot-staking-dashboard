import theme from 'styled-theming';
import { defaultThemes } from './default';

/* Aggregates all theme configurations and serves the currently
 * active theme via the theming context.
 */

// default background color of the page
export const backgroundColor: theme.ThemeSet = theme('mode', {
  ...defaultThemes.background.primary,
});
