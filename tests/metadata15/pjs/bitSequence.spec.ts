// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import type { AnyJson } from '@w3ux/types';
import * as metadataJson from '../../data/metadataV15_PJS.json';
import { describe, it } from 'vitest';

/* Metadata bitSequence tests.

This test file verifies the structure and integrity of bitSequence types in metadata.

All bitSequences are scraped and run through tests.

The goal of this test suit is to document how bitSequence types are structured to the developer. 
*/

// Basic bitSequence structure.
describe('Basic bitSequence structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get all bitSequence types from lookup.
  const lookupBitSequence = lookupTypes
    .filter(({ type: { def } }) => 'bitSequence' in def)
    .map((item) => item.type.def.bitSequence);

  it('Metadata lookup contains 1 bitSequence type', () => {
    assert.ok(lookupBitSequence.length === 1);
  });

  it('BitSequence types only contain `bitStoreType` and `bitOrderType` properties', () => {
    lookupBitSequence.every(
      (item: AnyJson) =>
        'bitStoreType' in item &&
        'bitOrderType' in item &&
        typeof item.bitStoreType === 'number' &&
        typeof item.bitOrderType === 'number' &&
        Object.keys(item).length === 2
    );
  });
});
