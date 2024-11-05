// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import type { AnyJson } from '@w3ux/types';
import * as metadataJson from '../../data/metadataV15_PJS.json';
import { describe, it } from 'vitest';

/* Metadata compact tests.

This test file verifies the structure and integrity of compact types in metadata.

All compact are scraped and run through tests.

The goal of this test suit is to document how compact types are structured to the developer. 
*/

// Basic compact structure.
describe('Basic compact structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get all composite types from lookup.
  const lookupCompact = lookupTypes
    .filter(({ type: { def } }) => 'compact' in def)
    .map((item) => item.type.def.compact);

  it('Metadata lookup contains 8 compact types', () => {
    assert.ok(lookupCompact.length === 8);
  });

  it('Compact types only contain one `type` property', () => {
    lookupCompact.every(
      (item: AnyJson) =>
        'type' in item &&
        typeof item.type === 'number' &&
        Object.keys(item).length === 1
    );
  });
});
