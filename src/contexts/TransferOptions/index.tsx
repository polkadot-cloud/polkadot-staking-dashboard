// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import React, { useEffect, useState } from 'react';
import type { MaybeAccount } from 'types';
import * as defaults from './defaults';
import type { TransferOptions, TransferOptionsContextInterface } from './types';

export const TransferOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    consts,
    network: { name, units, defaultFeeReserve },
  } = useApi();
  const { activeEra } = useNetworkMetrics();
  const { getStashLedger, getBalance, getLocks } = useBalances();
  const { getAccount } = useBonded();
  const { getAccountPoolMembership } = usePoolMemberships();
  const { existentialDeposit } = consts;
  const { activeAccount } = useConnect();

  // Get the local storage rcord for an account reserve balance.
  const getFeeReserveLocalStorage = (address: MaybeAccount) => {
    const reserves = JSON.parse(
      localStorage.getItem('reserve_balances') ?? '{}'
    );
    return new BigNumber(
      reserves?.[name]?.[address || ''] ??
        unitToPlanck(String(defaultFeeReserve), units)
    );
  };

  // A user-configurable reserve amount to be used to pay for transaction fees.
  const [feeReserve, setFeeReserve] = useState<BigNumber>(
    getFeeReserveLocalStorage(activeAccount)
  );

  // Update an account's reserve amount on account or network change.
  useEffect(() => {
    setFeeReserve(getFeeReserveLocalStorage(activeAccount));
  }, [activeAccount, name]);

  // Get the bond and unbond amounts available to the user
  const getTransferOptions = (address: MaybeAccount): TransferOptions => {
    const account = getAccount(address);
    if (account === null) {
      return defaults.transferOptions;
    }
    const balance = getBalance(address);
    const ledger = getStashLedger(address);
    const locks = getLocks(address);

    const { free } = balance;
    const { active, total, unlocking } = ledger;

    const totalLocked =
      locks?.reduce(
        (prev, { amount }) => prev.plus(amount),
        new BigNumber(0)
      ) || new BigNumber(0);

    // Calculate a forced amount of free balance that needs to be reserved to keep the account
    // alive. Deducts `locks` from free balance reserve needed.
    const edReserved = BigNumber.max(existentialDeposit.minus(totalLocked), 0);

    // Total free balance after `edReserved` is subtracted.
    const freeMinusReserve = BigNumber.max(free.minus(edReserved), 0);

    // calculate total balance locked
    const maxLockBalance =
      locks.reduce(
        (prev, current) => {
          return prev.amount.isGreaterThan(current.amount) ? prev : current;
        },
        { amount: new BigNumber(0) }
      )?.amount || new BigNumber(0);

    const points = getAccountPoolMembership(address)?.points;
    const poolPoints = points ? new BigNumber(points) : new BigNumber(0);

    // total amount actively unlocking
    let totalUnlocking = new BigNumber(0);
    let totalUnlocked = new BigNumber(0);
    for (const u of unlocking) {
      const { value, era } = u;
      if (activeEra.index.isGreaterThan(era)) {
        totalUnlocked = totalUnlocked.plus(value);
      } else {
        totalUnlocking = totalUnlocking.plus(value);
      }
    }

    // free balance after `total` ledger amount.
    const freeBalance = BigNumber.max(freeMinusReserve.minus(total), 0);

    const nominateOptions = () => {
      // total possible balance that can be bonded
      const totalPossibleBond = BigNumber.max(
        freeMinusReserve
          .minus(totalUnlocking)
          .minus(totalUnlocked)
          .minus(feeReserve),
        0
      );

      // total additional balance that can be bonded.
      const totalAdditionalBond = totalPossibleBond.minus(active);

      return {
        active,
        totalUnlocking,
        totalUnlocked,
        totalPossibleBond,
        totalAdditionalBond,
        totalUnlockChuncks: unlocking.length,
      };
    };

    const poolOptions = () => {
      const unlockingPool = getAccountPoolMembership(address)?.unlocking || [];

      // total possible balance that can be bonded
      const totalPossibleBondPool = BigNumber.max(
        freeMinusReserve.minus(maxLockBalance).minus(feeReserve),
        new BigNumber(0)
      );

      // total additional balance that can be bonded.
      const totalAdditionalBondPool = totalPossibleBondPool;

      let totalUnlockingPool = new BigNumber(0);
      let totalUnlockedPool = new BigNumber(0);
      for (const u of unlockingPool) {
        const { value, era } = u;
        if (activeEra.index.isGreaterThan(era)) {
          totalUnlockedPool = totalUnlockedPool.plus(value);
        } else {
          totalUnlockingPool = totalUnlockingPool.plus(value);
        }
      }
      return {
        active: poolPoints,
        totalUnlocking: totalUnlockingPool,
        totalUnlocked: totalUnlockedPool,
        totalPossibleBond: totalPossibleBondPool,
        totalAdditionalBond: totalAdditionalBondPool,
        totalUnlockChuncks: unlockingPool.length,
      };
    };

    return {
      freeBalance,
      edReserved,
      nominate: nominateOptions(),
      pool: poolOptions(),
    };
  };

  // Updates account's reserve amount in state and in local storage.
  const setFeeReserveBalance = (amount: BigNumber) => {
    if (!activeAccount) return;
    setFeeReserveLocalStorage(amount);
    setFeeReserve(amount);
  };

  // Update the local storage record for account reserve balances.
  const setFeeReserveLocalStorage = (amount: BigNumber) => {
    if (!activeAccount) return;

    try {
      const newReserves = JSON.parse(
        localStorage.getItem('reserve_balances') ?? '{}'
      );
      const newReservesNetwork = newReserves?.[name] ?? {};
      newReservesNetwork[activeAccount] = amount.toString();

      newReserves[name] = newReservesNetwork;
      localStorage.setItem('reserve_balances', JSON.stringify(newReserves));
    } catch (e) {
      // corrupted local storage record - remove it.
      localStorage.removeItem('reserve_balances');
    }
  };

  return (
    <TransferOptionsContext.Provider
      value={{
        getTransferOptions,
        setFeeReserveBalance,
        feeReserve,
      }}
    >
      {children}
    </TransferOptionsContext.Provider>
  );
};

export const TransferOptionsContext =
  React.createContext<TransferOptionsContextInterface>(
    defaults.defaultBondedContext
  );

export const useTransferOptions = () =>
  React.useContext(TransferOptionsContext);
