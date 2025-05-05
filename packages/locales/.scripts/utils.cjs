// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

const fs = require('fs')
const { join } = require('path')

// Project locale directory.
const localeDir = join(__dirname, '..', 'src', 'resources')

// The suffixes of keys related to i18n functionality that should be ignored.
const ignoreSuffixes = ['_one', '_two', '_few', '_many', '_other']

// Mapping of language variant suffixes
// To add more suffixed variants:
// 1. Add the mapping here (e.g., 'es': { 'es-MX': 'mx' })
// 2. Add the display entry in displayLocales in src/index.ts
// 3. Add the suffixed keys to the base locale (e.g., "key-mx": "Mexican Spanish Value")
const variantSuffixes = {
  en: {
    'en-GB': 'gb',
  },
}

// Check if value is an object. Do not count arrays as objects.
const isObject = (o) => (Array.isArray(o) ? false : typeof o === 'object')

// Locale directories, ommitting `en` - the langauge to check missing keys against.
const getDirectories = (source, omit) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((v) => !omit.includes(v.name))
    .map((dirent) => dirent.name)

// Check if key ends with a suffix from the list of ignored suffixes.
const endsWithIgnoreSuffix = (key) =>
  ignoreSuffixes.some((suffix) => key.endsWith(suffix))

// Check if a key is a variant suffix key
const isVariantSuffixKey = (key) => {
  for (const locale in variantSuffixes) {
    for (const lang in variantSuffixes[locale]) {
      const suffix = variantSuffixes[locale][lang]
      if (key.endsWith(`-${suffix}`)) {
        return true
      }
    }
  }
  return false
}

// Get deep keys from an object. This is used to retrieve all i18n keys in the object.
const getDeepKeys = (obj, prefix = '') => {
  const keys = []

  for (const key in obj) {
    // Format new key.
    const newKey = prefix === '' ? key : `${prefix}.${key}`

    // If value is an object, recurse.
    if (isObject(obj[key])) {
      keys.push(...getDeepKeys(obj[key], newKey))
    } else {
      // Skip keys that end with a suffix from the ignoreSuffixes array.
      if (endsWithIgnoreSuffix(key)) {
        continue
      }
      keys.push(newKey)
    }
  }

  return keys
}

// Get unsuffixed key from a key with variant suffix
const getUnsuffixedKey = (key) => {
  for (const locale in variantSuffixes) {
    for (const lang in variantSuffixes[locale]) {
      const suffix = variantSuffixes[locale][lang]
      if (key.endsWith(`-${suffix}`)) {
        return key.slice(0, -(suffix.length + 1))
      }
    }
  }
  return key
}

// Checks if a key exists in the default locale
const keyExistsInDefault = (defaultJson, key) => {
  const unsuffixedKey = getUnsuffixedKey(key)
  const parts = unsuffixedKey.split('.')
  let current = defaultJson
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return false
    }
    current = current[part]
  }
  
  return true
}

// Order JSON object alphabetically by keys.
const orderJsonByKeys = (obj) => {
  if (!isObject(obj)) {
    return obj
  }

  const ordered = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (isObject(obj[key])) {
        ordered[key] = orderJsonByKeys(obj[key])
      } else {
        ordered[key] = obj[key]
      }
    })

  return ordered
}

// Orders all keys in json alphabetically.
const orderKeysAlphabetically = (json) => {
  if (!isObject(json)) {
    return json
  }

  const ordered = {}
  Object.keys(json)
    .sort()
    .forEach((key) => {
      ordered[key] = isObject(json[key])
        ? orderKeysAlphabetically(json[key])
        : json[key]
    })

  return ordered
}

module.exports = {
  endsWithIgnoreSuffix,
  getDeepKeys,
  getDirectories,
  getUnsuffixedKey,
  ignoreSuffixes,
  isObject,
  isVariantSuffixKey,
  keyExistsInDefault,
  localeDir,
  orderJsonByKeys,
  orderKeysAlphabetically,
  variantSuffixes,
}
