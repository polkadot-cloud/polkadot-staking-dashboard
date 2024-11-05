// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import type { AnyJson } from '@w3ux/types';
import * as metadataJson from '../../data/metadataV15_PJS.json';
import { describe, it } from 'vitest';

/* Metadata array tests.

This test file verifies the structure and integrity of array types in metadata.

All array are scraped and run through tests.

The goal of this test suit is to document how array types are structured to the developer. 
*/

// Basic array structure.
describe('Basic array structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get all composite types from lookup.
  const lookupArray = lookupTypes
    .filter(({ type: { def } }) => 'array' in def)
    .map((item) => item.type.def.array);

  it('Metadata lookup contains 59 array types', () => {
    assert.equal(lookupArray.length, 32);
  });

  it('Array types only contain two properties - `len` and `type`', () => {
    lookupArray.every(
      (item: AnyJson) =>
        'len' in item &&
        'type' in item &&
        typeof item.len === 'number' &&
        typeof item.type === 'number' &&
        Object.keys(item).length === 2
    );
  });
});
