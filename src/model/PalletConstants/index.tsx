// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { V15 } from '@polkadot-api/substrate-bindings';

// Class to handle fetching pallet constants from metadata.
export class PalletConstants {
  // Holds the metadata lookup instance for accessing pallet metadata.
  metadataLookup: V15;

  // Constructor that initializes the PalletConstants with a `V15` instance.
  constructor(metadataLookup: V15) {
    this.metadataLookup = metadataLookup;
  }

  // Get a pallet constant value from metadata.
  // @param {string} palletName - The name of the pallet to look up.
  // @param {string} name - The name of the constant within the pallet.
  // @returns {any | null} - The value of the constant if found, otherwise null.
  getConstantValue(palletName: string, name: string) {
    // Retrieve the pallet metadata using the pallet name.
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      // Return undefined if the pallet is not found.
      return undefined;
    }

    // Defensive: Check if constants are defined for this pallet.
    const items = pallet.constants; // Access the constants defined in the pallet.
    let result = undefined; // Initialize result to store the constant value.

    // If constants are defined, search for the specified constant by name.
    if (items) {
      result = items.find((item) => item.name === name)?.value;
    }

    // Return the found constant value or undefined if not found.
    return result;
  }

  // Get a pallet from metadata.
  // @param {string} palletName - The name of the pallet to retrieve.
  // @returns {Pallet | undefined} - The pallet metadata if found, otherwise undefined.
  getPallet(palletName: string) {
    // Search for the specified pallet within the metadata lookup.
    const pallet = this.metadataLookup.pallets.find(
      ({ name }: { name: string }) => name === palletName // Destructure the name from pallet object.
    );

    // Return the found pallet or undefined if not found.
    return pallet;
  }
}
