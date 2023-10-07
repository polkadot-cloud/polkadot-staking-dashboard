// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';
import { defaultLedger } from './defaults';
import type { Ledger } from './types';

/**
 * @name getLedger
 * @summary Get an account's ledger record according to a key.
 * @param {Ledger} ledgers
 * @param {string} key
 * @param { MaybeAddress } address
 * @returns Ledger
 */
export const getLedger = (
  ledgers: Ledger[],
  key: 'stash' | 'address',
  address: MaybeAddress
): Ledger => ledgers.find((l) => l[key] === address) || defaultLedger;
