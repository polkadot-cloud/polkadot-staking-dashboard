// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

const fs = require('fs')
const { join } = require('path')
const {
  getDeepKeys,
  getDirectories,
  isVariantSuffixKey,
  keyExistsInDefault,
  localeDir,
  orderJsonByKeys,
} = require('./utils.cjs')

// Missing key validation function.
const validateMissingKeys = () => {
  const defaultPath = join(localeDir, 'en')
  const languages = getDirectories(localeDir, ['en'])

  fs.readdir(defaultPath, (error, files) => {
    if (error) {
      console.log(error)
    }

    files.forEach((file) => {
      const defaultJson = JSON.parse(
        fs.readFileSync(join(defaultPath, file)).toString()
      )

      for (const lng of languages) {
        const otherPath = join(localeDir, lng)
        const otherJson = JSON.parse(
          fs.readFileSync(join(otherPath, file)).toString()
        )

        const a = getDeepKeys(defaultJson)
        const b = getDeepKeys(otherJson)

        // Filter out suffixed keys that have a valid base key
        const filteredB = b.filter(key => {
          // If not a variant suffix key, include in check
          if (!isVariantSuffixKey(key)) {
            return true
          }
          
          // For variant suffix keys, verify the base exists in default
          return keyExistsInDefault(defaultJson, key)
        })

        if (a.sort().length !== filteredB.sort().length) {
          const missing = a.filter((item) => filteredB.indexOf(item) < 0)
          if (missing.join('').trim().length > 0) {
            throw new Error(
              `Missing the following keys from locale "${lng}", file: "${file}":\n"${missing}".`
            )
          }
        }
      }
    })
  })
}

// Key order validation function.
const validateKeyOrder = () => {
  // get all language paths to re-order.
  const languages = getDirectories(localeDir, [])

  for (const lng of languages) {
    const pathToLanguage = join(localeDir, `/${lng}`)

    fs.readdir(pathToLanguage, (error, files) => {
      if (error) {
        return
      }

      files.forEach((file) => {
        const pathToFile = join(pathToLanguage, file)
        const json = JSON.parse(fs.readFileSync(pathToFile).toString())

        // order json object alphabetically.
        const orderedJson = orderJsonByKeys(json)
        if (JSON.stringify(json) !== JSON.stringify(orderedJson)) {
          throw new Error(
            `Keys are in the incorrect order from locale "${lng}", file: "${file}".`
          )
        }
      })
    })
  }
}

// Start validation.
console.log(`\n📝 Validating locale files...`);
try {
  validateMissingKeys();
  validateKeyOrder();
  console.log('✅ All locale files are valid.');
} catch (error) {
  console.error('\n❌ Validation failed:');
  console.error(error.message);
  process.exit(1);
}
