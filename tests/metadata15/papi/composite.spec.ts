// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PAPI.json';
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

  // Get all composite types from lookup.
  const lookupComposite = lookup
    .filter(({ def: { tag } }) => tag === 'composite')
    .map((item) => item.def);

  // Get composite values from composite types. Every composite type has a single `value` property
  // alongside its `tag`.
  const compositeValues = lookupComposite.map(({ value }: AnyJson) => value);

  it('Metadata lookup contains 316 composite types', () => {
    assert.equal(lookupComposite.length, 316);
  });

  it('All `value` items contain `docs` and `type` properties`', () => {
    assert.ok(
      compositeValues.every((value: AnyJson) => {
        if (!Array.isArray(value)) {
          return false;
        }
        return value.every((item) => {
          if (
            !(
              'docs' in item &&
              'type' in item &&
              typeof item.type === 'number' &&
              [2, 3, 4].includes(Object.keys(item).length)
            ) // NOTE: additional `name` and `typeName` fields can be undefined
          ) {
            return false;
          }
          return true;
        });
      })
    );
  });
});
