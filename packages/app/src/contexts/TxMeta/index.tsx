// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { TxSubmissionItem } from 'api/types';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { isCustomEvent } from 'controllers/utils';
import { useActiveBalances } from 'hooks/useActiveBalances';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useEventListener } from 'usehooks-ts';
import * as defaults from './defaults';
import type { TxMetaContextInterface } from './types';

export const TxMetaContext = createContext<TxMetaContextInterface>(
  defaults.defaultTxMeta
);

export const useTxMeta = () => useContext(TxMetaContext);

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  const {
    consts: { existentialDeposit },
  } = useApi();

  // Store the transaction fees for the transaction.
  const [txFees, setTxFees] = useState<BigNumber>(new BigNumber(0));

  // Store the sender of the transaction.
  const [sender, setSender] = useState<MaybeAddress>(null);

  // Store whether the sender does not have enough funds.
  const [notEnoughFunds, setNotEnoughFunds] = useState<boolean>(false);

  // Listen to balance updates for the tx sender.
  const { getBalance, getEdReserved } = useActiveBalances({
    accounts: [sender],
  });

  // Store uids of transactions, along with their processing status.
  const [uids, setUids] = useState<TxSubmissionItem[]>([]);

  // Utility to reset transaction fees to zero.
  const resetTxFees = () => {
    setTxFees(new BigNumber(0));
  };

  // Check if the transaction fees are valid.
  const txFeesValid = txFees.isZero() || notEnoughFunds ? false : true;

  const handleNewUidStatus = (e: Event) => {
    if (isCustomEvent(e)) {
      const { uids: eventUids } = e.detail;
      setUids(eventUids);
    }
  };

  // Get a tx submission.
  const getTxSubmission = (uid?: number) =>
    uids.find((item) => item.uid === uid);

  // Refresh not enough funds status when sender, balance or txFees change.
  const senderBalances = getBalance(sender);
  useEffectIgnoreInitial(() => {
    const edReserved = getEdReserved(sender, existentialDeposit);
    const { free, frozen } = senderBalances;
    const balanceforTxFees = free.minus(edReserved).minus(frozen);

    setNotEnoughFunds(balanceforTxFees.minus(txFees).isLessThan(0));
  }, [txFees, sender, senderBalances]);

  useEventListener(
    'new-tx-uid-status',
    handleNewUidStatus,
    useRef<Document>(document)
  );

  return (
    <TxMetaContext.Provider
      value={{
        uids,
        getTxSubmission,
        setSender,
        // TODO: add to tx `uid` state.
        txFees,
        txFeesValid,
        setTxFees,
        resetTxFees,
        // TODO: add to tx `uid` state.
        notEnoughFunds,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  );
};
