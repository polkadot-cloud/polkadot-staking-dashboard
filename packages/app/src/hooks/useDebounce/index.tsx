// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import debounce from 'lodash.debounce'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

  useEffect(
    () => () => {
      debouncedFn.cancel()
    },
    [debouncedFn]
  )

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
 * Specialized hook for search inputs that prevents character disappearing
 * Maintains local input state while debouncing the search logic
 * @param onSearch - Function to call with search value (debounced)
 * @param initialValue - Initial value for the input
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Object with inputValue, handleInputChange, and setInputValue
 */
export const useDebouncedSearchInput = (
  onSearch: (value: string) => void,
  initialValue = '',
  delay = 300
) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [hasUserTyped, setHasUserTyped] = useState(false)
  const debouncedSearch = useDebounce(onSearch, delay)

  // Update local input immediately, debounce the search logic
  const handleInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      setInputValue(value) // Immediate UI update - prevents character disappearing
      setHasUserTyped(true) // Mark that user has started typing
      debouncedSearch(value) // Debounced search logic
    },
    [debouncedSearch]
  )

  // Only sync with external value if user hasn't typed yet
  useEffect(() => {
    if (!hasUserTyped) {
      setInputValue(initialValue)
    }
  }, [initialValue, hasUserTyped])

  // Reset user typed flag when initial value changes significantly
  useEffect(() => {
    if (initialValue === '') {
      setHasUserTyped(false)
    }
  }, [initialValue])

  return {
    inputValue,
    handleInputChange,
    setInputValue,
  }
}
