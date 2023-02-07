// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
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

  // the theme mode
  const [theme, setTheme] = React.useState<string>(localTheme);
  const themeRef = useRef(theme);

  // auto change theme on system change
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      const newhTheme = event.matches ? 'dark' : 'light';
      localStorage.setItem('theme', newhTheme);
      setStateWithRef(newhTheme, setTheme, themeRef);
    });

  const toggleTheme = (newTheme: string | null = null): void => {
    if (newTheme === null) {
      newTheme = theme === 'dark' ? 'light' : 'dark';
    }

    localStorage.setItem('theme', newTheme);
    setStateWithRef(newTheme, setTheme, themeRef);
  };

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        mode: themeRef.current,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
