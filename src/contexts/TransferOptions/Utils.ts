// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@polkadot-cloud/react/types';
import { unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { NetworkName } from 'types';

// Get the local storage record for an account reserve balance.
export const getLocalFeeReserve = (
  address: MaybeAddress,
  defaultReserve: number,
  { network, units }: { network: NetworkName; units: number }
): BigNumber => {
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
): void => {
  if (!address) {
    return;
  }
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
