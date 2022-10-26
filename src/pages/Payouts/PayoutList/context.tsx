// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PayoutListContextInterface } from 'pages/Pools/types';
import React, { useState } from 'react';

export const PayoutListContext =
  React.createContext<PayoutListContextInterface>({
    // eslint-disable-next-line
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
