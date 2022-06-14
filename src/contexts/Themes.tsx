// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export const ThemeContext: React.Context<any> = React.createContext({
  toggleTheme: (str?: string) => {},
  toggleCard: (c: string) => {},
  mode: 'light',
  card: 'flat',
});

export const useTheme = () => React.useContext(ThemeContext);

export const ThemesProvider = ({ children }: { children: React.ReactNode }) => {
  // get the current theme
  let localTheme = localStorage.getItem('theme');
  let localCard = localStorage.getItem('card');

  // provide default theme if not set
  if (localTheme !== 'light' && localTheme !== 'dark') {
    localTheme = 'light';
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

  const toggleTheme = (_theme: string | null = null): void => {
    if (_theme === null) {
      _theme = state.mode === 'dark' ? 'light' : 'dark';
    }
    localStorage.setItem('theme', _theme);
    setState({
      ...state,
      mode: _theme,
    });
  };

  const toggleCard = (_card: string): void => {
    localStorage.setItem('card', _card);
    setState({
      ...state,
      card: _card,
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        toggleCard,
        mode: state.mode,
        card: state.card,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
