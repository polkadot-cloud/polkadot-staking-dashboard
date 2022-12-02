// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
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
  const { metrics } = useNetworkMetrics();
  const { getAccount, getAccountBalance, getLedgerForStash, getAccountLocks } =
    useBalances();
  const { membership } = usePoolMemberships();
  const { activeEra } = metrics;

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
    let totalLockedBalance = new BN(0);
    locks.forEach((l: Lock) => {
      totalLockedBalance = totalLockedBalance.add(l.amount);
    });

    const points = membership?.points;
    const activePool = points ? new BN(points) : new BN(0);

    // total amount actively unlocking
    let totalUnlocking = new BN(0);
    let totalUnlocked = new BN(0);
    for (const u of unlocking) {
      const { value, era } = u;
      if (activeEra.index > era) {
        totalUnlocked = totalUnlocked.add(value);
      } else {
        totalUnlocking = totalUnlocking.add(value);
      }
    }

    // free balance after reserve. Does not consider locks other than staking.
    const freeBalance = BN.max(freeAfterReserve.sub(total), new BN(0));

    const nominateOptions = () => {
      // total possible balance that can be bonded
      const totalPossibleBond = BN.max(
        freeAfterReserve.sub(totalUnlocking).sub(totalUnlocked),
        new BN(0)
      );

      return {
        active,
        freeToUnbond: active,
        totalUnlocking,
        totalUnlocked,
        totalPossibleBond,
        totalUnlockChuncks: unlocking.length,
      };
    };

    const poolOptions = () => {
      const unlockingPool = membership?.unlocking || [];

      // total possible balance that can be bonded
      const totalPossibleBondPool = BN.max(
        freeAfterReserve.sub(totalLockedBalance),
        new BN(0)
      );

      let totalUnlockingPool = new BN(0);
      let totalUnlockedPool = new BN(0);
      for (const u of unlockingPool) {
        const { value, era } = u;
        if (activeEra.index > era) {
          totalUnlockedPool = totalUnlockedPool.add(value);
        } else {
          totalUnlockingPool = totalUnlockingPool.add(value);
        }
      }
      return {
        active: activePool,
        freeToUnbond: activePool,
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
