// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import * as defaults from './defaults';

export interface EstimatedFeeContext {
  txFees: BN;
  notEnoughFunds: boolean;
  setTxFees: (f: BN) => void;
  resetTxFees: () => void;
  txFeesValid: boolean;
}

export const TxFeesContext = React.createContext<EstimatedFeeContext>(
  defaults.defaultTxFees
);

export const useTxFees = () => React.useContext(TxFeesContext);

export const TxFeesProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeAccount } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { freeBalance } = getTransferOptions(activeAccount);

  const [txFees, _setTxFees] = useState(new BN(0));
  const [notEnoughFunds, setNotEnoughFunds] = useState(false);

  useEffect(() => {
    setNotEnoughFunds(freeBalance.sub(txFees).lt(new BN(0)));
  }, [txFees]);

  const setTxFees = (fees: BN) => {
    _setTxFees(fees);
  };

  const resetTxFees = () => {
    _setTxFees(new BN(0));
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
        txFeesValid,
      }}
    >
      {children}
    </TxFeesContext.Provider>
  );
};
