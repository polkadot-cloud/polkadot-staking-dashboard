// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PAPI.json';
import { describe, it } from 'vitest';

/* Metadata primitive tests.

This test file verifies the structure and integrity of primitive types in metadata.

All primitives are scraped and run through tests.

The goal of this test suit is to document how primitive types are structured to the developer. 
*/

// Basic primitive structure.
describe('Basic primitive structure is intact', () => {
  const lookup = metadataJson.lookup;

  // Get all primitive types from lookup.
  const lookupPrimitive = lookup
    .filter(({ def: { tag } }) => tag === 'primitive')
    .map((item) => item.def.value);

  // NOTE: The primitive types present in the test metadata do not exhaust all possible primitive
  // types supported in Substrate.
  it('Metadata lookup contains 8 primitive types', () => {
    assert.ok(lookupPrimitive.length === 8);
  });

  it('Primitive types are strings representing the primitive type', () => {
    lookupPrimitive.every((item) => typeof item === 'string');
  });
});
