// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import type { MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { TransferOptions, TransferOptionsContextInterface } from './types';
import {
  getMaxLock,
  getLocalFeeReserve,
  getUnlocking,
  setLocalFeeReserve,
} from './Utils';
import {
  defaultTransferOptions,
  defaultTransferOptionsContext,
} from './defaults';

export const TransferOptionsContext =
  React.createContext<TransferOptionsContextInterface>(
    defaultTransferOptionsContext
  );

export const useTransferOptions = () =>
  React.useContext(TransferOptionsContext);

export const TransferOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { consts } = useApi();
  const { getAccount } = useBonded();
  const { activeEra } = useNetworkMetrics();
  const { membership } = usePoolMemberships();
  const { activeAccount } = useActiveAccounts();
  const {
    network,
    networkData: { units, defaultFeeReserve },
  } = useNetwork();
  const { getStashLedger, getBalance, getLocks } = useBalances();
  const { existentialDeposit } = consts;

  // A user-configurable reserve amount to be used to pay for transaction fees.
  const [feeReserve, setFeeReserve] = useState<BigNumber>(
    getLocalFeeReserve(activeAccount, defaultFeeReserve, { network, units })
  );

  // Get the bond and unbond amounts available to the user
  const getTransferOptions = (address: MaybeAddress): TransferOptions => {
    if (getAccount(address) === null) return defaultTransferOptions;

    const { free, frozen } = getBalance(address);
    const { active, total, unlocking } = getStashLedger(address);
    const locks = getLocks(address);
    const maxLock = getMaxLock(locks);

    // Calculate a forced amount of free balance that needs to be reserved to keep the account
    // alive. Deducts `locks` from free balance reserve needed.
    const edReserved = BigNumber.max(existentialDeposit.minus(maxLock), 0);

    // Total free balance after `edReserved` is subtracted.
    const freeMinusReserve = BigNumber.max(
      free.minus(edReserved).minus(feeReserve),
      0
    );

    // Free balance that can be transferred.
    const transferrableBalance = BigNumber.max(
      freeMinusReserve.minus(frozen),
      0
    );

    // Gree balance to pay for tsx fees. Does not factor `feeReserve`.
    const balanceTxFees = BigNumber.max(
      free.minus(edReserved).minus(frozen),
      0
    );

    // Staking specific balances.
    //
    // Total amount unlocking and unlocked.
    const { totalUnlocking, totalUnlocked } = getUnlocking(
      unlocking,
      activeEra.index
    );

    // Free balance to stake after `total` (total staked) ledger amount.
    const freeBalance = BigNumber.max(freeMinusReserve.minus(total), 0);

    // Get nominator-specific balances.
    const nominatorBalances = () => {
      const totalPossibleBond = BigNumber.max(
        freeMinusReserve.minus(totalUnlocking).minus(totalUnlocked),
        0
      );
      return {
        active,
        totalUnlocking,
        totalUnlocked,
        totalPossibleBond,
        totalAdditionalBond: BigNumber.max(totalPossibleBond.minus(active), 0),
        totalUnlockChunks: unlocking.length,
      };
    };

    // Get pool-member-specific balances.
    const poolBalances = () => {
      const unlockingPool = membership?.unlocking || [];
      const {
        totalUnlocking: totalUnlockingPool,
        totalUnlocked: totalUnlockedPool,
      } = getUnlocking(unlockingPool, activeEra.index);

      return {
        active: membership?.balance || new BigNumber(0),
        totalUnlocking: totalUnlockingPool,
        totalUnlocked: totalUnlockedPool,
        totalPossibleBond: BigNumber.max(freeMinusReserve.minus(maxLock), 0),
        totalUnlockChunks: unlockingPool.length,
      };
    };

    return {
      freeBalance,
      transferrableBalance,
      balanceTxFees,
      edReserved,
      nominate: nominatorBalances(),
      pool: poolBalances(),
    };
  };

  // Updates account's reserve amount in state and in local storage.
  const setFeeReserveBalance = (amount: BigNumber) => {
    if (!activeAccount) return;
    setLocalFeeReserve(activeAccount, amount, network);
    setFeeReserve(amount);
  };

  // Update an account's reserve amount on account or network change.
  useEffectIgnoreInitial(() => {
    setFeeReserve(
      getLocalFeeReserve(activeAccount, defaultFeeReserve, { network, units })
    );
  }, [activeAccount, network]);

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
