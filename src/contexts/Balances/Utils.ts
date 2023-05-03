// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MaybeAccount } from 'types';
import { defaultLedger } from './defaults';
import type { Ledger } from './types';

/**
 * @name getLedger
 * @summary Get an account's ledger record according to a key.
 * @param {Ledger} ledgers
 * @param {string} key
 * @param { MaybeAccount } address
 * @returns Ledger
 */
export const getLedger = (
  ledgers: Ledger[],
  key: 'stash' | 'address',
  address: MaybeAccount
): Ledger => ledgers.find((l: Ledger) => l[key] === address) || defaultLedger;
