// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export const ThemeContext: React.Context<any> = React.createContext({
  toggleTheme: (str?: string) => { },
  mode: 'light',
});

export const useTheme = () => React.useContext(ThemeContext);

export const ThemesProvider = ({ children }: any) => {
  // get the current theme
  let localTheme = localStorage.getItem('theme');

  // provide default theme if not set
  if (localTheme !== 'light' && localTheme !== 'dark') {
    localTheme = 'light';
    localStorage.setItem('theme', localTheme);
  }

  // the theme state
  const [state, setState] = React.useState({
    mode: localTheme,
  });

  const toggleTheme = (_theme: string | null = null): void => {
    if (_theme === null) {
      _theme = (state.mode === 'dark' ? 'light' : 'dark');
    }

    localStorage.setItem('theme', _theme);

    setState({
      ...state,
      mode: _theme,
    });
  };

  return (
    <ThemeContext.Provider value={{
      toggleTheme,
      mode: state.mode,
    }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
