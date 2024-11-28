// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import { unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { NetworkId } from 'types';

// Get the local storage record for an account reserve balance.
export const getLocalFeeReserve = (
  address: MaybeAddress,
  defaultReserve: number,
  { network, units }: { network: NetworkId; units: number }
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
  network: NetworkId
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
