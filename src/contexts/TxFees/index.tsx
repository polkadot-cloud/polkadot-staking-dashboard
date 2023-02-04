// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import React, { useEffect, useRef, useState } from 'react';
import { MaybeAccount } from 'types';
import { setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import { EstimatedFeeContext } from './types';

export const TxFeesContext = React.createContext<EstimatedFeeContext>(
  defaults.defaultTxFees
);

export const useTxFees = () => React.useContext(TxFeesContext);

export const TxFeesProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeAccount } = useConnect();
  const { getTransferOptions } = useTransferOptions();

  // store the transaction fees for the transaction.
  const [txFees, setTxFees] = useState(new BigNumber(0));

  // store whether payment info is currently being fetched.
  const [fetchingPaymentInfo, setFetchingPaymentInfoState] = useState(false);
  const fetchingPaymentInfoRef = useRef(fetchingPaymentInfo);

  const setFetchingPaymentInfo = (v: boolean) => {
    setStateWithRef(v, setFetchingPaymentInfoState, fetchingPaymentInfoRef);
  };

  // store the sender of the transaction
  const [sender, setSender] = useState<MaybeAccount>(activeAccount);

  // store whether the sender does not have enough funds.
  const [notEnoughFunds, setNotEnoughFunds] = useState(false);

  useEffect(() => {
    const { freeBalance } = getTransferOptions(sender);
    setNotEnoughFunds(freeBalance.minus(txFees).isLessThan(new BigNumber(0)));
  }, [txFees, sender]);

  const resetTxFees = () => {
    setSender(null);
    setTxFees(new BigNumber(0));
  };

  const txFeesValid = (() => {
    if (txFees.isZero() || notEnoughFunds) {
      return false;
    }
    return true;
  })();

  return (
    <TxFeesContext.Provider
      value={{
        txFees,
        notEnoughFunds,
        setTxFees,
        resetTxFees,
        setSender,
        txFeesValid,
        fetchingPaymentInfo: fetchingPaymentInfoRef.current,
        setFetchingPaymentInfo,
      }}
    >
      {children}
    </TxFeesContext.Provider>
  );
};
