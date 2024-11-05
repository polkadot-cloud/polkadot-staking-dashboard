// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PAPI.json';
import type { AnyJson } from '@w3ux/types';
import { describe, it } from 'vitest';

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

  // Get variant types from lookup.
  const lookupVariants = lookup
    .filter(({ def: { tag } }) => tag === 'variant')
    .map((item) => item.def);

  // Get variant values from variant types. Every variant type has a single `variants`
  // property.
  const variantValues = lookupVariants.map((item: AnyJson) => item.value);

  it('Metadata lookup contains 381 variants', () => {
    assert.equal(lookupVariants.length, 381);
  });

  it('All variant values are arrays', () => {
    assert.ok(variantValues.every((value: AnyJson) => Array.isArray(value)));
  });

  it('All `variant` values contain the same properties', () => {
    assert.ok(
      variantValues.every((value: AnyJson) =>
        value.every((item: AnyJson) => {
          if (
            !(
              'fields' in item &&
              'docs' in item &&
              'index' in item &&
              'name' in item &&
              Object.keys(item).length === 4
            )
          ) {
            return false;
          }
          return true;
        })
      )
    );
  });

  it('Variant `fields` all contain the same properties', () => {
    assert.ok(
      variantValues.every((item: AnyJson) => {
        for (const variantItem of item) {
          // Ignore variants with no fields.
          if (!variantItem.fields.length) {
            continue;
          }

          const { fields } = variantItem;
          assert.ok(Array.isArray(fields));

          for (const field of fields) {
            if (
              !(
                'type' in field &&
                'docs' in field &&
                [2, 3, 4].includes(Object.keys(field).length)
              ) // NOTE: additional `name` and `typeName` fields can be undefined
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
