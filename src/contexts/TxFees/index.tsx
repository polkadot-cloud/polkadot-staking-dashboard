// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import React, { useEffect, useState } from 'react';
import { MaybeAccount } from 'types';
import * as defaults from './defaults';

export interface EstimatedFeeContext {
  txFees: BN;
  notEnoughFunds: boolean;
  setTxFees: (f: BN) => void;
  resetTxFees: () => void;
  setSender: (s: MaybeAccount) => void;
  txFeesValid: boolean;
}

export const TxFeesContext = React.createContext<EstimatedFeeContext>(
  defaults.defaultTxFees
);

export const useTxFees = () => React.useContext(TxFeesContext);

export const TxFeesProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeAccount } = useConnect();
  const { getTransferOptions } = useTransferOptions();

  // store the transaction fees for the transaction.
  const [txFees, _setTxFees] = useState(new BN(0));

  // store the sender of the transaction
  const [sender, setSender] = useState<MaybeAccount>(activeAccount);

  // store whether the sender does not have enough funds.
  const [notEnoughFunds, setNotEnoughFunds] = useState(false);

  useEffect(() => {
    const { freeBalance } = getTransferOptions(sender);
    setNotEnoughFunds(freeBalance.sub(txFees).lt(new BN(0)));
  }, [txFees, sender]);

  const setTxFees = (fees: BN) => {
    setSender(null);
    _setTxFees(fees);
  };

  const resetTxFees = () => {
    setSender(null);
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
        setSender,
        txFeesValid,
      }}
    >
      {children}
    </TxFeesContext.Provider>
  );
};
