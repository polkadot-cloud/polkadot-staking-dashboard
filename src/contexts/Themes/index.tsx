// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultThemeContext } from './defaults';
import { ThemeContextInterface } from './types';

export const ThemeContext =
  React.createContext<ThemeContextInterface>(defaultThemeContext);

export const useTheme = () => React.useContext(ThemeContext);

export const ThemesProvider = ({ children }: { children: React.ReactNode }) => {
  // get the current theme
  let localTheme = localStorage.getItem('theme') || '';

  // provide default theme if not set
  if (!['light', 'dark'].includes(localTheme)) {
    // check system theme
    localTheme =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    localStorage.setItem('theme', localTheme);
  }

  // the theme state
  const [state, setState] = React.useState<{ mode: string; card: string }>({
    mode: localTheme,
    card: 'shadow',
  });
  const stateRef = useRef(state);

  // auto change theme on system change
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      const _theme = event.matches ? 'dark' : 'light';
      localStorage.setItem('theme', _theme);
      setStateWithRef(
        { ...stateRef.current, mode: _theme },
        setState,
        stateRef
      );
    });

  const toggleTheme = (_theme: string | null = null): void => {
    if (_theme === null) {
      _theme = state.mode === 'dark' ? 'light' : 'dark';
    }
    localStorage.setItem('theme', _theme);
    setStateWithRef({ ...stateRef.current, mode: _theme }, setState, stateRef);
  };

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        mode: stateRef.current.mode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
