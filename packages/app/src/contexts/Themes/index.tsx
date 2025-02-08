// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { defaultThemeContext } from './defaults'
import type { Theme, ThemeContextInterface } from './types'

export const ThemeContext =
  createContext<ThemeContextInterface>(defaultThemeContext)

export const useTheme = () => useContext(ThemeContext)

export const ThemesProvider = ({ children }: { children: ReactNode }) => {
  let initialTheme: Theme = 'light'

  // get the current theme
  const localThemeRaw = localStorage.getItem('theme') || ''

  // Provide system theme if raw theme is not valid
  if (!['light', 'dark'].includes(localThemeRaw)) {
    const systemTheme =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

    initialTheme = systemTheme
    localStorage.setItem('theme', systemTheme)
  } else {
    // `localThemeRaw` is a valid theme
    initialTheme = localThemeRaw as Theme
  }

  // The current theme mode
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const themeRef = useRef(theme)

  // Automatically change theme on system change
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      const newTheme = event.matches ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      setStateWithRef(newTheme, setTheme, themeRef)
    })

  const toggleTheme = (maybeTheme: Theme | null = null): void => {
    const newTheme =
      maybeTheme || (themeRef.current === 'dark' ? 'light' : 'dark')

    localStorage.setItem('theme', newTheme)
    setStateWithRef(newTheme, setTheme, themeRef)
  }

  // A ref to refer to the Entry component that stores the theme variables.
  const themeElementRef = useRef<HTMLDivElement>(null)

  // Get a CSS variable value from theme container
  const getThemeValue = useCallback(
    (variable: string) => {
      if (!themeElementRef.current) {
        return ''
      }
      const style = getComputedStyle(themeElementRef.current)
      const value = style?.getPropertyValue(variable).trim()
      return value
    },
    [theme]
  )

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        themeElementRef,
        getThemeValue,
        mode: themeRef.current,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
