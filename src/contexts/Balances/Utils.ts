// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { BalanceLock, UnlockChunk } from './types';

// Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
export const getMaxLock = (locks: BalanceLock[]) =>
  locks.reduce(
    (prev, current) =>
      prev.amount.isGreaterThan(current.amount) ? prev : current,
    { amount: new BigNumber(0) }
  )?.amount || new BigNumber(0);

// Gets the total unlocking and unlocked amount.
export const getUnlocking = (chunks: UnlockChunk[], thisEra: BigNumber) => {
  let totalUnlocking = new BigNumber(0);
  let totalUnlocked = new BigNumber(0);

  for (const { value, era } of chunks) {
    if (thisEra.isGreaterThan(era)) {
      totalUnlocked = totalUnlocked.plus(value);
    } else {
      totalUnlocking = totalUnlocking.plus(value);
    }
  }
  return { totalUnlocking, totalUnlocked };
};
