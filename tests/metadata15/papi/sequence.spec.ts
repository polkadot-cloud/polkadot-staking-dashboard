// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PAPI.json';
import type { AnyJson } from '@w3ux/types';
import { describe, it } from 'vitest';

/* Metadata sequence tests.

This test file verifies the structure and integrity of sequence types in metadata.

All sequences are scraped and run through tests.

The goal of this test suit is to document how sequence types are structured to the developer. 
*/

// Basic sequence structure.
describe('Basic sequence structure is intact', () => {
  const lookup = metadataJson.lookup;

  // Get all sequence types from lookup.
  const lookupSequence = lookup
    .filter(({ def: { tag } }) => tag === 'sequence')
    .map((item) => item.def);

  it('Metadata lookup contains 127 sequence types', () => {
    assert.equal(lookupSequence.length, 127);
  });

  it('Sequence definitions only contain a `tag` and `value` property', () => {
    lookupSequence.every(
      (def: AnyJson) =>
        'tag' in def && `value` in def && Object.keys(def).length === 2
    );
  });
});
