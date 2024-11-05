// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import assert from 'assert';
import * as metadataJson from '../../data/metadataV15_PAPI.json';
import { describe, it } from 'vitest';

/* Metadata lookup tests.

This test file verifies the structure and integrity of the metadata lookup object.

The goal of this test suit is to document how lookups are structured to the developer.

NOTES:
- The `path` property is a string array that represents the path to the type in the metadata. The
  last element in the array is the type name, such as a composite (struct) or variant (enum) name.
*/

describe('Metadata lookup structure is intact', () => {
  const lookup = metadataJson.lookup;

  it('Lookup exists at metadata top level', () => {
    const keys = Object.keys(metadataJson);
    assert.ok(keys.includes('lookup'));
  });

  it('Lookup type `id`s are numbers', () => {
    const result = lookup.every((item) => typeof item.id === 'number');
    assert.ok(result);
  });

  it('All lookup types contain the same outer structure', () => {
    assert.ok(
      lookup.every(
        (type) =>
          'def' in type &&
          'docs' in type &&
          'path' in type &&
          'params' in type &&
          'id' in type &&
          Object.keys(type).length === 5
      )
    );
  });

  it('Provided lookup contains 968 types', () => {
    assert.equal(lookup.length, 968);
  });
});
