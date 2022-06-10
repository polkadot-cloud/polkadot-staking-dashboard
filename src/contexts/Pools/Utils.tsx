// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

export const EMPTY_H256 = new Uint8Array(32);

export const MOD_PREFIX = stringToU8a('modl');

export const U32_OPTS = { bitLength: 32, isLe: true };
