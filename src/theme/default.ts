// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

const v = (light: string, dark: string) => ({
  light: light,
  dark: dark,
});

export const defaultThemes = {
  text: {
    primary: v('#333', '#ddd'),
    secondary: v('#555', '#aaa'),
    invert: v('#fafafa', '#0e0e0e'),
    danger: v('#ae2324', '#d14445'),
  },
  background: {
    primary: v('#f7f7f7', '#111'),
    gradient: v(
      'linear-gradient(180deg, rgba(247,247,247,1) 0%, rgba(247,247,247,1) 100px, rgba(229,229,229,1) 100%)',
      'linear-gradient(180deg, rgba(23,23,23,1) 0%, rgba(26,26,26,1) 100px, rgba(12,12,12,1) 100%)'
    ),
    secondary: v('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.25)'),
    network: v(
      'rgba(229,229,229,0.75)',
      'rgba(27,27,27,0.75)'
    ),
    dropdown: v('rgba(237,237,237,0.4)', 'rgba(19,19,19,0.4)'),
    label: v('rgba(220,220,220,0.75)', 'rgba(36,36,36,0.75)'),
  },
  highlight: {
    primary: v(
      'linear-gradient(90deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.03) 100%)',
      'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 100%)'
    ),
    secondary: v(
      'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)',
      'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
    ),
  },
  buttons: {
    primary: {
      background: v('#ebebeb', '#0c0c0c'),
    }
  }
};

export default defaultThemes;