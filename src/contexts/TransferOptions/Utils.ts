// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@polkadot-cloud/react/types';
import { unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { BalanceLock, UnlockChunk } from 'contexts/Balances/types';
import type { NetworkName } from 'types';

// Gets the total unlocking and unlocked amount.
export const getUnlocking = (chunks: UnlockChunk[], thisEra: BigNumber) => {
  let totalUnlocking = new BigNumber(0);
  let totalUnlocked = new BigNumber(0);

  for (const { value, era } of chunks)
    if (thisEra.isGreaterThan(era)) {
      totalUnlocked = totalUnlocked.plus(value);
    } else {
      totalUnlocking = totalUnlocking.plus(value);
    }
  return { totalUnlocking, totalUnlocked };
};

// Gets the total locked amount from an account's locks.
export const getLocked = (locks: BalanceLock[]) =>
  locks?.reduce((prev, { amount }) => prev.plus(amount), new BigNumber(0)) ||
  new BigNumber(0);

// Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
export const getMaxLock = (locks: BalanceLock[]) =>
  locks.reduce(
    (prev, current) =>
      prev.amount.isGreaterThan(current.amount) ? prev : current,
    { amount: new BigNumber(0) }
  )?.amount || new BigNumber(0);

// Get the local storage record for an account reserve balance.
export const getLocalFeeReserve = (
  address: MaybeAddress,
  defaultReserve: number,
  { network, units }: { network: NetworkName; units: number }
) => {
  const reserves = JSON.parse(localStorage.getItem('reserve_balances') ?? '{}');
  return new BigNumber(
    reserves?.[network]?.[address || ''] ??
      unitToPlanck(String(defaultReserve), units)
  );
};

// Sets the local storage record fro an account reserve balance.
export const setLocalFeeReserve = (
  address: MaybeAddress,
  amount: BigNumber,
  network: NetworkName
) => {
  if (!address) return;
  try {
    const newReserves = JSON.parse(
      localStorage.getItem('reserve_balances') ?? '{}'
    );
    const networkReserves = newReserves?.[network] ?? {};
    networkReserves[address] = amount.toString();
    newReserves[network] = networkReserves;
    localStorage.setItem('reserve_balances', JSON.stringify(newReserves));
  } catch (e) {
    localStorage.removeItem('reserve_balances');
  }
};
