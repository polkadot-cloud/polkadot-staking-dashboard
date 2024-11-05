// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PJS.json';
import type { AnyJson } from '@w3ux/types';
import { describe, it, test } from 'vitest';

/* Metadata variants tests.

This test file verifies the structure and integrity of variants in metadata.

All variants are scraped and run through tests.The goal of this test suit is to document how variants are structured to the developer. 

TODO: Beyond the basic variant structure, the types variants hold are also tested to document the
correct structure, e.g. a variants of tuples, composites, or enums.

NOTES:
- Variant values with no `fields` are simple enum variants, and can be defined as strings in JS.
- Variant values with `fields` are typed enum variants, and can be defined as objects in JS.
*/

// Basic variant structure.
describe('Basic variant structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get variant types from lookup.
  const lookupVariants = lookupTypes
    .filter(({ type: { def } }) => 'variant' in def)
    .map((item) => item.type.def.variant);

  // Get variant definitions from variant types. Every variant type has a single `variants`
  // property.
  const variantDefs = lookupVariants.map((item: AnyJson) => item.variants);

  it('Metadata lookup contains 318 variants', () => {
    assert.equal(lookupVariants.length, 332);
  });

  it('Variants only contain one `variants` property', () => {
    lookupVariants.every(
      (item: AnyJson) => 'variants' in item && Object.keys(item).length === 1
    );
  });

  it('All `variants` contain the same array of properties', () => {
    assert.ok(
      variantDefs.every((item: AnyJson) => {
        if (!Array.isArray(item)) {
          return false;
        }
        for (const variantItem of item) {
          if (
            !(
              'name' in variantItem &&
              'fields' in variantItem &&
              'index' in variantItem &&
              'docs' in variantItem &&
              Object.keys(variantItem).length === 4
            )
          ) {
            return false;
          }
        }
        return true;
      })
    );
  });

  test('Variant `fields` all contain the same properties', () => {
    assert.ok(
      variantDefs.every((item: AnyJson) => {
        if (!Array.isArray(item)) {
          return false;
        }

        for (const variantItem of item) {
          // Ignore variants with no fields.
          if (!variantItem.fields.length) {
            continue;
          }
          const { fields } = variantItem;
          for (const field of fields) {
            if (
              !(
                'name' in field &&
                'type' in field &&
                'typeName' in field &&
                'docs' in field &&
                typeof field.type === 'number' &&
                Object.keys(field).length === 4
              )
            ) {
              return false;
            }
          }
        }
        return true;
      })
    );
  });
});
