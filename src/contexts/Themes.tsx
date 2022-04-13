import React from "react";

export const ThemeContext: React.Context<any> = React.createContext({
  toggleTheme: (str?: string) => { },
  mode: 'light',
});

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeContextWrapper: React.FC = ({ children }) => {

  // get the current theme, or provide default theme if not set.
  const currentTheme = () => {
    let _theme = localStorage.getItem('theme');
    if (_theme === null) {
      _theme = 'light';
      localStorage.setItem('theme', _theme);
    }
    return _theme;
  }

  // the theme state
  const [state, setState] = React.useState({
    mode: currentTheme(),
  });

  const toggleTheme = (_theme: string | null = null): void => {

    if (_theme === null) {
      _theme = (state.mode === 'dark' ? 'light' : `dark`);
    }

    localStorage.setItem('theme', _theme);

    setState({
      ...state,
      mode: _theme,
    });
  }

  return (
    <ThemeContext.Provider value={{
      toggleTheme: toggleTheme,
      mode: state.mode,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}