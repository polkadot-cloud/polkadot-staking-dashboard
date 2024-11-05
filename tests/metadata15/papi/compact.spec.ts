// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import type { AnyJson } from '@w3ux/types';
import * as metadataJson from '../../data/metadataV15_PAPI.json';
import { describe, it } from 'vitest';

/* Metadata compact tests.

This test file verifies the structure and integrity of compact types in metadata.

All compact are scraped and run through tests.

The goal of this test suit is to document how compact types are structured to the developer. 
*/

// Basic compact structure.
describe('Basic compact structure is intact', () => {
  const lookup = metadataJson.lookup;

  // Get all composite types from lookup.
  const lookupCompactValues = lookup
    .filter(({ def: { tag } }) => tag === 'compact')
    .map((item) => item.def);

  it('Metadata lookup contains 8 compact types', () => {
    assert.ok(lookupCompactValues.length === 8);
  });

  it('Compact defs only contain a `tag` and `value` property', () => {
    lookupCompactValues.every(
      (item: AnyJson) =>
        'tag' in item &&
        'value' in item &&
        typeof item.value === 'number' &&
        Object.keys(item).length === 2
    );
  });
});
