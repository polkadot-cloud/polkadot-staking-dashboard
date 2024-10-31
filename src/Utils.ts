// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';

// Return `planckToUnit` as a `BigNumber`.
export const planckToUnitBn = (val: BigNumber, units: number): BigNumber =>
  new BigNumber(planckToUnit(val.toString(), units));

// Converts a string to a BigNumber.
export const stringToBn = (value: string): BigNumber =>
  new BigNumber(rmCommas(value));
