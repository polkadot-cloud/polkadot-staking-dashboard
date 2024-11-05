// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import type { AnyJson } from '@w3ux/types';
import * as metadataJson from '../../data/metadataV15_PJS.json';
import { describe, it } from 'vitest';

/* Metadata tuple tests.

This test file verifies the structure and integrity of tuple types in metadata.

All tuples are scraped and run through tests.

The goal of this test suit is to document how tuple types are structured to the developer. 
*/

// Basic tuple structure.
describe('Basic tuple structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get all tuple types from lookup.
  const lookupTuple = lookupTypes
    .filter(({ type: { def } }) => 'tuple' in def)
    .map((item) => item.type.def.tuple);

  it('Metadata lookup contains 85 tuple types', () => {
    assert.equal(lookupTuple.length, 82);
  });

  it('Tuple types contain an array of numbers representing the type at that index of the tuple. Tuples contain at least 1 index', () => {
    lookupTuple.every(
      (item: AnyJson) =>
        Array.isArray(item) &&
        item.every((i: number) => typeof i === 'number') &&
        item.length > 0
    );
  });
});
