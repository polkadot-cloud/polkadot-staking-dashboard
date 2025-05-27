// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'

// Define suffix mappings for different locales
export const suffixes: Record<string, Record<string, string>> = {
  en: {
    'en-GB': 'gb', // within "en" locale, the "en-GB" language is supported with the "gb" suffix
  },
}

/**
 * Helper function to get a potentially suffixed locale key
 * If a specific suffixed version of the key exists, it will be used
 * Otherwise, falls back to the regular key
 * @param key - The base locale key
 * @returns Either the suffixed key if it exists, or the original key
 */
export const useWithSuffix = () => {
  const { i18n, t } = useTranslation()

  return (key: string) => {
    // Get current locale and language
    const locale = i18n.language
    const browserLang = navigator.language

    // Check if there's a suffix defined for this locale and language
    const localeSuffixes = suffixes[locale]
    if (!localeSuffixes) {
      return t(key)
    }

    const suffix = localeSuffixes[browserLang]
    if (!suffix) {
      return t(key)
    }

    // Check if the suffixed key exists
    const suffixedKey = `${key}-${suffix}`

    // i18next will return the key itself if it doesn't exist
    // To check if a key exists, we need to see if the translation is different from the key
    const translation = t(suffixedKey)
    if (translation !== suffixedKey) {
      return translation
    }

    // Fall back to the original key
    return t(key)
  }
}
