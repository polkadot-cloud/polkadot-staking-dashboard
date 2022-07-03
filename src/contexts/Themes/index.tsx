// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultThemeContext } from './defaults';

export const ThemeContext = React.createContext<any>(defaultThemeContext);

export const useTheme = () => React.useContext(ThemeContext);

export const ThemesProvider = ({ children }: { children: React.ReactNode }) => {
  // get the current theme
  let localTheme = localStorage.getItem('theme');
  let localCard = localStorage.getItem('card');

  // provide default theme if not set
  if (localTheme !== 'light' && localTheme !== 'dark') {
    // check system theme
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      localTheme = 'dark';
    } else {
      localTheme = 'light';
    }
    localStorage.setItem('theme', localTheme);
  }

  // provide default card if not set
  if (!['flat', 'border', 'shadow'].includes(localCard || '')) {
    localCard = 'shadow';
    localStorage.setItem('card', localCard);
  }

  // the theme state
  const [state, setState] = React.useState({
    mode: localTheme,
    card: localCard,
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

  const toggleCard = (_card: string): void => {
    localStorage.setItem('card', _card);
    setStateWithRef({ ...stateRef.current, card: _card }, setState, stateRef);
  };

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        toggleCard,
        mode: stateRef.current.mode,
        card: stateRef.current.card,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
