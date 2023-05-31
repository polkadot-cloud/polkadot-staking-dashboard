// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { setStateWithRef } from '@polkadotcloud/utils';
import React, { useRef } from 'react';
import { defaultThemeContext } from './defaults';
import type { Theme, ThemeContextInterface } from './types';

export const ThemesProvider = ({ children }: { children: React.ReactNode }) => {
    let initialTheme: Theme = 'dark';

    // get the current theme
    localStorage.setItem('theme', 'dark');

    // the theme mode
    const [theme, setTheme] = React.useState<Theme>(initialTheme);
    const themeRef = useRef(theme);

    const toggleTheme = (maybeTheme: Theme | null = null): void => {
        // Do nothing
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

export const ThemeContext =
    React.createContext<ThemeContextInterface>(defaultThemeContext);

export const useTheme = () => React.useContext(ThemeContext);
