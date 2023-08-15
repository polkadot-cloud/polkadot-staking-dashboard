// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import React, { useState } from 'react';
import type { PayoutListContextInterface } from 'pages/Pools/types';

export const PayoutListContext =
  React.createContext<PayoutListContextInterface>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setListFormat: (v: string) => {},
    listFormat: 'col',
  });

export const usePayoutList = () => React.useContext(PayoutListContext);

export const PayoutListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listFormat, _setListFormat] = useState('col');

  const setListFormat = (v: string) => {
    _setListFormat(v);
  };

  return (
    <PayoutListContext.Provider
      value={{
        setListFormat,
        listFormat,
      }}
    >
      {children}
    </PayoutListContext.Provider>
  );
};
