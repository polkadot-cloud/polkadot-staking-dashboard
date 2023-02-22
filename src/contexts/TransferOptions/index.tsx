// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useBalances } from 'contexts/Balances';
import { Lock } from 'contexts/Balances/types';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import React from 'react';
import { MaybeAccount } from 'types';
import * as defaults from './defaults';
import { TransferOptions, TransferOptionsContextInterface } from './types';

export const TransferOptionsContext =
  React.createContext<TransferOptionsContextInterface>(
    defaults.defaultBalancesContext
  );

export const useTransferOptions = () =>
  React.useContext(TransferOptionsContext);

export const TransferOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { activeEra } = useNetworkMetrics();
  const { getAccount, getAccountBalance, getLedgerForStash, getAccountLocks } =
    useBalances();
  const { membership } = usePoolMemberships();

  // get the bond and unbond amounts available to the user
  const getTransferOptions = (address: MaybeAccount): TransferOptions => {
    const account = getAccount(address);
    if (account === null) {
      return defaults.transferOptions;
    }
    const balance = getAccountBalance(address);
    const ledger = getLedgerForStash(address);
    const locks = getAccountLocks(address);

    const { freeAfterReserve } = balance;
    const { active, total, unlocking } = ledger;

    // calculate total balance locked after staking
    let totalLockedBalance = new BigNumber(0);
    locks.forEach((l: Lock) => {
      totalLockedBalance = totalLockedBalance.plus(l.amount);
    });

    const points = membership?.points;
    const activePool = points ? new BigNumber(points) : new BigNumber(0);

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

    // free balance after reserve. Does not consider locks other than staking.
    const freeBalance = BigNumber.max(freeAfterReserve.minus(total), 0);

    const nominateOptions = () => {
      // total possible balance that can be bonded
      const totalPossibleBond = BigNumber.max(
        freeAfterReserve.minus(totalUnlocking).minus(totalUnlocked),
        0
      );

      return {
        active,
        totalUnlocking,
        totalUnlocked,
        totalPossibleBond,
        totalUnlockChuncks: unlocking.length,
      };
    };

    const poolOptions = () => {
      const unlockingPool = membership?.unlocking || [];

      // total possible balance that can be bonded
      const totalPossibleBondPool = BigNumber.max(
        freeAfterReserve.minus(totalLockedBalance),
        new BigNumber(0)
      );

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
        active: activePool,
        totalUnlocking: totalUnlockingPool,
        totalUnlocked: totalUnlockedPool,
        totalPossibleBond: totalPossibleBondPool,
        totalUnlockChuncks: unlockingPool.length,
      };
    };

    return {
      freeBalance,
      nominate: nominateOptions(),
      pool: poolOptions(),
    };
  };

  return (
    <TransferOptionsContext.Provider
      value={{
        getTransferOptions,
      }}
    >
      {children}
    </TransferOptionsContext.Provider>
  );
};
