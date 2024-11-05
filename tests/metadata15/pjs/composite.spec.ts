// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PJS.json';
import type { AnyJson } from '@w3ux/types';
import { describe, it } from 'vitest';

/* Metadata composite tests.

This test file verifies the structure and integrity of composite types in metadata.

All composites are scraped and run through tests.

The goal of this test suit is to document how composite types are structured to the developer. 
*/

// Basic composite structure.
describe('Basic composite structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get all composite types from lookup.
  const lookupComposite = lookupTypes
    .filter(({ type: { def } }) => 'composite' in def)
    .map((item) => item.type.def.composite);

  // Get composite fields from composite types. Every composite type has a single `fields`
  // property.
  const compositeFields = lookupComposite.map(({ fields }: AnyJson) => fields);

  it('Metadata lookup contains 280 composite types', () => {
    assert.equal(lookupComposite.length, 285);
  });

  it('Composite types only contain one `fields` property', () => {
    lookupComposite.every(
      (item: AnyJson) => 'fields' in item && Object.keys(item).length === 1
    );
  });

  it('All `fields` contain the same array of properties', () => {
    assert.ok(
      compositeFields.every((item: AnyJson) => {
        if (!Array.isArray(item)) {
          return false;
        }
        for (const compositeItem of item) {
          if (
            !(
              'name' in compositeItem &&
              'type' in compositeItem &&
              'typeName' in compositeItem &&
              'docs' in compositeItem &&
              typeof compositeItem.type === 'number' &&
              Object.keys(compositeItem).length === 4
            )
          ) {
            return false;
          }
        }
        return true;
      })
    );
  });
});
