# Localization in Polkadot Staking Dashboard

This package handles localization for the Polkadot Staking Dashboard.

## Locale Variants

The dashboard supports language variants like British English (en-GB) compared to US English (en) through a suffix-based approach that minimizes duplication.

### How Language Variants Work

Instead of duplicating entire locale files for minor spelling or terminology differences, we use a suffix system:

1. Base locales are defined in `src/index.ts` in the `locales` object.
2. Language variants are defined in `displayLocales` for UI selection, but don't require full locale files.
3. Variants use suffix mappings defined in `src/util/suffix.ts`.
4. Only the differing keys need to be defined with the appropriate suffix in the base locale file.

### Example

For British English (en-GB) variants:

1. The mapping is defined in the `suffixes` object:
   ```typescript
   export const suffixes: Record<string, Record<string, string>> = {
     en: {
       'en-GB': 'gb', // within "en" locale, the "en-GB" language is supported with the "gb" suffix
     },
   }
   ```

2. In the `en` locale files, British spellings are added as suffixed keys:
   ```json
   {
     "favorite": "Favorite",
     "favorite-gb": "Favourite",
     "analyzingPoolPerformance": "Analyzing pool performance",
     "analyzingPoolPerformance-gb": "Analysing pool performance"
   }
   ```

3. In code, the `useWithSuffix` hook is used to fetch the right variant:
   ```typescript
   import { useWithSuffix } from 'locales/util'
   
   // In your component
   const withSuffix = useWithSuffix()
   
   // Usage
   withSuffix('favorite') // Returns "Favourite" for en-GB users, "Favorite" for others
   ```

### Adding a New Variant

To add a new language variant:

1. Add the mapping to `variantSuffixes` in `packages/locales/.scripts/utils.cjs`:
   ```javascript
   const variantSuffixes = {
     en: {
       'en-GB': 'gb',
     },
     es: {
       'es-MX': 'mx', // Add Mexican Spanish variant
     },
   }
   ```

2. Add the display entry in `displayLocales` in `src/index.ts`:
   ```typescript
   export const displayLocales: Record<string, LocaleEntry> = {
     // existing entries...
     'es-MX': { dateFormat: es, label: 'Español (México)', variant: 'es' },
   }
   ```

3. Add the suffixed keys to the base locale files (e.g., `/resources/es/app.json`):
   ```json
   {
     "someKey": "Spanish value",
     "someKey-mx": "Mexican Spanish value"
   }
   ```

4. Use the `withSuffix` helper in components to fetch the correct variants.

## Benefits

- Dramatically reduces duplication of locale files
- Easier to maintain - only need to add differences
- Automatic fallback to base locale when no suffix exists
- Locale validation includes suffixed keys 