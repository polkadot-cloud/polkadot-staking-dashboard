// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';

const v = (light: string, dark: string) => ({
  light,
  dark,
});

export const defaultThemes: { [key: string]: AnyJson } = {
  text: {
    invert: v('#fafafa', '#0e0e0e'),
  },
  graphs: {
    colors: [v('#ccc', '#555'), v('#eee', '#222')],
    inactive: v('#cfcfcf', '#1a1a1a'),
    inactive2: v('#dadada', '#383838'),
    tooltip: v('#333', '#ddd'),
    grid: v('#e8e8e8', '#222'),
  },
  buttons: {
    toggle: { background: v('rgba(242,241,240,1)', '#1d1d1d') },
    help: { background: v('#ececec', '#242424') },
    hover: { background: v('#e8e6e6', '#080808') },
    disabled: {
      background: v('#F3F6F4', '#000000'),
      text: v('#ececec', '#444444'),
    },
  },
  border: {
    secondary: v('#ccc', '#444'),
  },
  loader: {
    foreground: v('#e1e1e1', '#151515'),
    background: v('#dadada', '#101010'),
  },
  shadow: {
    primary: v('#dedede', '#1f1f1f'),
    secondary: v('#eaeaea', '#222'),
  },
};
