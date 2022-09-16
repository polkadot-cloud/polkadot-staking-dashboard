// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';
import { MaybeAccount } from 'types';
import { useNetworkMetrics } from 'contexts/Network';
import { useBalances } from 'contexts/Balances';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { TransferOptions, TransferOptionsContextInterface } from './types';
import * as defaults from './defaults';

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
  const { getAccount, getAccountBalance, getLedgerForStash } = useBalances();
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
    const { freeAfterReserve } = balance;
    const { active, unlocking } = ledger;

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

    // free to bond balance
    const freeBalance = BN.max(
      freeAfterReserve.sub(active).sub(totalUnlocking).sub(totalUnlocked),
      new BN(0)
    );

    const nominateOptions = () => {
      const freeToUnbond = active;

      // total possible balance that can be bonded
      const totalPossibleBond = BN.max(
        freeAfterReserve.sub(activePool).sub(totalUnlocking).sub(totalUnlocked),
        new BN(0)
      );

      return {
        active,
        freeToUnbond,
        totalUnlocking,
        totalUnlocked,
        totalPossibleBond,
        totalUnlockChuncks: unlocking.length,
      };
    };

    const poolOptions = () => {
      const unlockingPool = membership?.unlocking || [];
      const freeToUnbondPool = activePool;

      // total possible balance that can be bonded
      const totalPossibleBondPool = BN.max(
        freeAfterReserve
          .sub(active)
          .sub(totalUnlocking)
          .sub(totalUnlocked)
          .add(activePool),
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
        freeToUnbond: freeToUnbondPool,
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
