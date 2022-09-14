// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import * as defaults from './defaults';

export interface EstimatedFeeContext {
  txFees: BN;
  notEnoughFunds: boolean;
  setTxFees: (f: BN) => void;
  resetTxFees: () => void;
}

export const TxFeesContext = React.createContext<EstimatedFeeContext>(
  defaults.defaultTxFees
);

export const useTxFees = () => React.useContext(TxFeesContext);

export const TxFeesProvider = ({ children }: { children: React.ReactNode }) => {
  const { consts } = useApi();
  const { activeAccount } = useConnect();
  const { getTransferOptions } = useBalances();
  const { freeBalance } = getTransferOptions(activeAccount);
  const { existentialDeposit } = consts;

  const [txFees, _setTxFees] = useState(new BN(0));

  const [notEnoughFunds, setNotEnoughFunds] = useState(false);

  useEffect(() => {
    setNotEnoughFunds(freeBalance.sub(txFees).lt(existentialDeposit));
  }, [txFees]);

  const setTxFees = (fees: BN) => {
    _setTxFees(fees);
  };

  const resetTxFees = () => {
    _setTxFees(new BN(0));
  };

  return (
    <TxFeesContext.Provider
      value={{
        txFees,
        notEnoughFunds,
        setTxFees,
        resetTxFees,
      }}
    >
      {children}
    </TxFeesContext.Provider>
  );
};
