// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyApi, MaybeAccount } from 'types';
import * as defaults from './defaults';
import type { Ledger } from './types';

/**
 * @name getLedger
 * @summary Get an account's ledger record according to a key.
 * @param {AnyApi} ledgers
 * @param {string} key
 * @param { MaybeAccount } address
 * @returns AnyApi
 */
export const getLedger = (
  ledgers: AnyApi,
  key: 'stash' | 'address',
  address: MaybeAccount
): AnyApi => ledgers.find((l: Ledger) => l[key] === address) || defaults.ledger;
