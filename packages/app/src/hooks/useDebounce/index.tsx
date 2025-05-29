// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import debounce from 'lodash.debounce'
import type { FormEvent } from 'react'
import { useCallback, useMemo } from 'react'

/**
 * Custom hook for debouncing function calls
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced function
 */
export const useDebounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  delay = 300
): T => {
  const debouncedFn = useMemo(() => debounce(fn, delay), [fn, delay])

  // Cleanup on unmount
  return useCallback(((...args: Parameters<T>) => debouncedFn(...args)) as T, [
    debouncedFn,
  ])
}

/**
 * Specialized hook for debouncing search input changes
 * @param onSearch - Function to call with search value
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced search handler
 */
export const useDebouncedSearch = (
  onSearch: (value: string) => void,
  delay = 300
) => {
  const debouncedSearch = useDebounce(onSearch, delay)

  return useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      debouncedSearch(value)
    },
    [debouncedSearch]
  )
}

/**
 * Specialized hook for debouncing numeric input changes (like bond amounts)
 * @param onChange - Function to call with numeric value
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced change handler
 */
export const useDebouncedNumericInput = (
  onChange: (value: string) => void,
  delay = 500
) => {
  const debouncedChange = useDebounce(onChange, delay)

  return useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      debouncedChange(value)
    },
    [debouncedChange]
  )
}
