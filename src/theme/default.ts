// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NETWORKS } from 'config/networks';
import { Network } from 'types';

// configure theme
const v = (light: string, dark: string) => ({
  light,
  dark,
});

// eslint-disable-next-line
export const defaultThemes: { [key: string]: any } = {
  transparent: v('rgba(255,255,255,0', 'rgba(0,0,0,0)'),
  text: {
    primary: v('#333', '#ccc'),
    secondary: v('#444', '#aaa'),
    invert: v('#fafafa', '#0e0e0e'),
    warning: v('#be7900', '#be7900'),
    danger: v('#ae2324', '#d14445'),
    success: v('#66d16f', '#66d16f'),
  },
  background: {
    primary: v('rgba(245,244,244,1)', '#111b24'),
    gradient: v(
      'linear-gradient(180deg, rgba(245,244,244,1) 0%, rgba(245,244,244,1) 100px, rgba(230,230,230, 1) 80%, rgba(253,239,234,1) 100%)',
      '#111b24'
    ),
    secondary: v('rgba(255,255,255,0.58)', '#14202a'),
    network: v('rgba(244,225,225,0.75)', 'rgba(39,39,39,0.75)'),
    dropdown: v('rgba(237,237,237,0.6)', '#16232e'),
    modalitem: v('rgba(244,244,244,0.6)', 'rgba(22,22,22,0.4)'),
    validator: v(
      'linear-gradient(90deg, rgba(240,240,239,0.95) 0%, rgba(240,240,239,0.7) 100%)',
      'linear-gradient(90deg, rgba(30,30,30,0.8) 0%, rgba(30,30,30,0.5) 100%)'
    ),
    label: v(
      'linear-gradient(90deg, rgba(243,240,239,1) 0%, rgba(243,240,239,0.95) 100%)',
      'linear-gradient(90deg, rgba(40,40,40,0.85) 0%, rgba(40,40,40,0.95) 100%)'
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
    colors: [v('#bccbd6', '#2f4252'), v('#edf0f3', '#182733')],
    inactive: v('#cfdae3', '#16232e'),
    inactive2: v('#bde4eb', '#1b2b38'),
    tooltip: v('#e3e9ef', '#182733'),
    grid: v('#e8e8e8', '#222'),
  },
  buttons: {
    primary: { background: v('rgba(248, 248, 248, 0.9)', '#0f0f0f') },
    secondary: { background: v('#eeecec', '#1b2b38') },
    toggle: { background: v('rgba(244,243,242,1)', '#1a1a1a') },
    help: { background: v('#ececec', '#242424') },
    hover: { background: v('#e8e6e6', '#080808') },
    disabled: {
      background: v('#F3F6F4', '#000000'),
      text: v('#ececec', '#444444'),
    },
  },
  border: {
    primary: v('#e6e6e6', '#1b2b38'),
    secondary: v('#ccc', '#444'),
  },
  modal: {
    overlay: v('rgba(242,240,240,0.6)', 'rgba(16,16,16,0.6)'),
    background: v('#fff', '#0b0b0b'),
  },
  overlay: {
    background: v('rgba(200,200,200,0.45)', 'rgba(30,30,30,0.6)'),
  },
  help: {
    button: {
      background: v('rgba(255,255,255,0.90)', 'rgba(0,0,0,0.85)'),
    },
  },
  loader: {
    foreground: v('#e1e1e1', '#151515'),
    background: v('#dadada', '#101010'),
  },
  shadow: {
    primary: v('transparent', 'transparent'),
    secondary: v('transparent', 'transparent'),
  },
  status: {
    danger: {
      solid: v('red', 'red'),
      transparent: v('rgba(255,0,0,0.25)', 'rgba(255,0,0,0.25)'),
    },
    warning: {
      solid: v('rgba(219, 161, 0, 1)', 'rgba(219, 161, 0,1)'),
      transparent: v('rgba(255,165,0,0.5)', 'rgba(255,165,0,0.5)'),
    },
    success: {
      solid: v('#66d16f', '#66d16f'),
      transparent: v('rgba(0,128,0,0.25)', 'rgba(0,128,0,0.25)'),
    },
  },
};

// configure card style
const c = (flat: string, border: string, shadow: string) => ({
  flat,
  border,
  shadow,
});

// eslint-disable-next-line
export const cardThemes = {
  card: {
    border: c('none', '1px solid', 'none'),
    shadow: c('none', 'none', '-2px 2px 10px'),
  },
};

// configure network colors
export const networkColors: { [key: string]: string } = {};
export const networkColorsSecondary: { [key: string]: string } = {};
export const networkColorsStroke: { [key: string]: string } = {};
export const networkColorsTransparent: { [key: string]: string } = {};

Object.values(NETWORKS).forEach((node: Network) => {
  const { name, colors } = node;
  const { primary, secondary, stroke, transparent } = colors;

  networkColors[`${name}-light`] = primary.light;
  networkColors[`${name}-dark`] = primary.dark;

  networkColorsSecondary[`${name}-light`] = secondary.light;
  networkColorsSecondary[`${name}-dark`] = secondary.dark;

  networkColorsStroke[`${name}-light`] = stroke.light;
  networkColorsStroke[`${name}-dark`] = stroke.dark;

  networkColorsTransparent[`${name}-light`] = transparent.light;
  networkColorsTransparent[`${name}-dark`] = transparent.dark;
});
