// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

const v = (light: string, dark: string) => ({
  light: light,
  dark: dark,
});

export const defaultThemes: any = {
  transparent: v('rgba(255,255,255,0', 'rgba(0,0,0,0)'),
  primary: v('rgb(211, 48, 121)', 'rgb(211, 48, 121)'),
  secondary: v('rgb(211, 48, 121)', 'rgb(211, 48, 121)'),
  text: {
    primary: v('#333', '#ccc'),
    secondary: v('#444', '#aaa'),
    invert: v('#fafafa', '#0e0e0e'),
    danger: v('#ae2324', '#d14445'),
  },
  background: {
    primary: v('rgba(245,245,245,1)', 'rgba(27,27,27,1)'),
    gradient: v(
      'linear-gradient(180deg, rgba(245,245,245,1) 0%, rgba(245,245,245,1) 100px, rgba(229,229,229,1) 100%)',
      'linear-gradient(180deg, rgba(27,27,27,1) 0%, rgba(27,27,27,1) 100px, rgba(21,21,21,1) 100%)'
    ),
    secondary: v('rgba(255,255,255,0.5)', 'rgba(0,0,0,0.16)'),
    network: v('rgba(229,229,229,0.75)', 'rgba(27,27,27,0.75)'),
    dropdown: v('rgba(237,237,237,0.4)', 'rgba(19,19,19,0.4)'),
    label: v('rgba(220,220,220,0.75)', 'rgba(36,36,36,0.75)'),
    validator: v(
      'linear-gradient(90deg, rgba(240,240,240,1) 0%, rgba(240,240,240,0.7) 100%)',
      'linear-gradient(90deg, rgba(28,28,28.8) 0%, rgba(28,28,28,0.5) 100%)'
    ),
    announcement: v(
      'linear-gradient(90deg, rgba(240,240,240,1) 0%, rgba(240,240,240,0.7) 100%)',
      'linear-gradient(90deg, rgba(18,18,18,0.8) 0%, rgba(18,18,18,0.5) 100%)'
    ),
    identicon: v('#eee', '#333'),
    overlay: v(
      'linear-gradient(180deg, rgba(242,242,242,0.93) 0%, rgba(225,225,225,0.93) 100%)',
      'linear-gradient(180deg, rgba(20,20,20,0.93) 0%, rgba(14,14,14,0.93) 100%)'
    ),
  },
  highlight: {
    primary: v(
      'linear-gradient(90deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.03) 100%)',
      'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%)'
    ),
    secondary: v(
      'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)',
      'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
    ),
  },
  graphs: {
    colors: [v('#d33079', '#d33079'), v('#ccc', '#555'), v('#eee', '#222')],
    inactive: v('#ddd', '#333'),
    tooltip: v('#333', '#ddd'),
    grid: v('#eee', '#222'),
  },
  buttons: {
    primary: { background: v('#f8f8f8', '#0f0f0f') },
    secondary: { background: v('#ebebeb', '#111') },
    toggle: { background: v('#f4f4f4', '#1a1a1a') },
  },
  border: {
    primary: v('#eee', '#222'),
  },
  modal: {
    overlay: v('rgba(240,240,240, 0.6)', 'rgba(16,16,16, 0.6)'),
    background: v('#fff', '#000'),
  },
  assistant: {
    background: v('rgba(228,228,228,0.93)', 'rgba(18,18,18,0.93)'),
    link: v('#d33079', '#d33079'),
    button: {
      background: v('rgba(255,255,255,0.65)', 'rgba(0,0,0,0.4)'),
    }
  },
  loader: {
    foreground: v('#e1e1e1', '#111'),
    background: v('#dadada', '#181818'),
  }
};

export default defaultThemes;