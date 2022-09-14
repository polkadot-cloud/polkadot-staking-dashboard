// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';

export const TxFeesContext = React.createContext<any>({
  txFees: new BN(0),
  setTxFees: () => {},
});

export const useTxFees = () => React.useContext(TxFeesContext);

export const TxFeesProvider = ({ children }: { children: React.ReactNode }) => {
  const [txFees, _setTxFees] = useState(new BN(0));

  const setTxFees = (fees: any) => {
    _setTxFees(fees);
  };

  const resetTxFees = () => {
    _setTxFees(new BN(0));
  };

  return (
    <TxFeesContext.Provider
      value={{
        txFees,
        setTxFees,
        resetTxFees,
      }}
    >
      {children}
    </TxFeesContext.Provider>
  );
};
