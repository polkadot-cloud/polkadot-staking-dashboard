// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NODE_ENDPOINTS } from 'consts';
import { NodeEndpoint } from 'types';

// configure theme
const v = (light: string, dark: string) => ({
  light,
  dark,
});

export const defaultThemes: any = {
  transparent: v('rgba(255,255,255,0', 'rgba(0,0,0,0)'),
  text: {
    primary: v('#333', '#ccc'),
    secondary: v('#444', '#aaa'),
    invert: v('#fafafa', '#0e0e0e'),
    danger: v('#ae2324', '#d14445'),
  },
  background: {
    primary: v('rgba(248,247,247,1)', 'rgba(27,27,27,1)'),
    gradient: v(
      'linear-gradient(180deg, rgba(248,247,247,1) 0%, rgba(248,247,247,1) 100px, rgba(233,233,233, 1) 85%, rgba(252,242,241,1) 100%)',
      'linear-gradient(180deg, rgba(27,27,27,1) 0%, rgba(27,27,27,1) 100px, rgba(21,21,21,1) 100%)'
    ),
    secondary: v('rgba(255,255,255,0.58)', 'rgba(0,0,0,0.16)'),
    network: v('rgba(244,225,225,0.75)', 'rgba(27,27,27,0.75)'),
    dropdown: v('rgba(237,237,237,0.4)', 'rgba(19,19,19,0.4)'),
    validator: v(
      'linear-gradient(90deg, rgba(240,240,239,0.95) 0%, rgba(240,240,239,0.7) 100%)',
      'linear-gradient(90deg, rgba(28,28,28.8) 0%, rgba(28,28,28,0.5) 100%)'
    ),
    label: v(
      'linear-gradient(90deg, rgba(243,240,239,1) 0%, rgba(243,240,239,0.7) 100%)',
      'linear-gradient(90deg, rgba(18,18,18,0.8) 0%, rgba(18,18,18,0.5) 100%)'
    ),
    tag: v('rgba(220,220,220,0.75)', 'rgba(36,36,36,0.75)'),
    identicon: v('#eee', '#333'),
    overlay: v(
      'linear-gradient(180deg, rgba(244,242,242,0.93) 0%, rgba(228,225,225,0.93) 100%)',
      'linear-gradient(180deg, rgba(20,20,20,0.93) 0%, rgba(14,14,14,0.93) 100%)'
    ),
  },
  highlight: {
    primary: v(
      'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)',
      'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)'
    ),
    secondary: v(
      'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)',
      'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
    ),
  },
  graphs: {
    colors: [v('#ccc', '#555'), v('#eee', '#222')],
    inactive: v('#cfcfcf', '#1a1a1a'),
    inactive2: v('#dadada', '#383838'),
    tooltip: v('#333', '#ddd'),
    grid: v('#eee', '#222'),
  },
  buttons: {
    primary: { background: v('rgba(248, 248, 248, 0.9)', '#0f0f0f') },
    secondary: { background: v('rgba(238, 236, 236, 0.9)', '#111') },
    toggle: { background: v('rgba(242,240,239,0.8)', '#1a1a1a') },
    assistant: { background: v('#ececec', '#242424') },
  },
  border: {
    primary: v('#e6e6e6', '#2a2a2a'),
    secondary: v('#ccc', '#444'),
  },
  modal: {
    overlay: v('rgba(242,240,240, 0.6)', 'rgba(16,16,16, 0.6)'),
    background: v('#fff', '#000'),
  },
  assistant: {
    background: v('rgba(234,230,230,0.93)', 'rgba(18,18,18,0.93)'),
    link: v('#d33079', '#d33079'),
    button: {
      background: v('rgba(255,255,255,0.60)', 'rgba(0,0,0,0.4)'),
    },
  },
  loader: {
    foreground: v('#e1e1e1', '#151515'),
    background: v('#dadada', '#101010'),
  },
  shadow: v('#eaeaea', '#181818'),
};

// configure card style
const c = (flat: string, border: string, shadow: string) => ({
  flat,
  border,
  shadow,
});

export const cardThemes: any = {
  card: {
    border: c('none', '1px solid', 'none'),
    shadow: c('none', 'none', '-2px 2px 26px'),
  },
};

// configure network colors
export const networkColors: any = [];
export const networkColorsSecondary: any = [];

Object.values(NODE_ENDPOINTS).forEach((node: NodeEndpoint) => {
  const { name, colors } = node;
  const { primary, secondary } = colors;

  networkColors[`${name}-light`] = primary.light;
  networkColors[`${name}-dark`] = primary.dark;

  networkColorsSecondary[`${name}-light`] = secondary.light;
  networkColorsSecondary[`${name}-dark`] = secondary.dark;
});
