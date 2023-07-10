// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

type ListFormat = 'row' | 'col';

interface PoolListContextProps {
  setListFormat: (v: ListFormat) => void;
  listFormat: ListFormat;
}

const defaultListFormat = 'col';

const defaultPoolList: PoolListContextProps = {
  // eslint-disable-next-line
  setListFormat: (v) => {},
  listFormat: defaultListFormat,
};

export const PoolListContext: React.Context<PoolListContextProps> =
  React.createContext(defaultPoolList);

export const usePoolList = () => React.useContext(PoolListContext);

export const PoolListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listFormat, setListFormatState] =
    useState<ListFormat>(defaultListFormat);

  const setListFormat = (v: ListFormat) => setListFormatState(v);

  return (
    <PoolListContext.Provider
      value={{
        setListFormat,
        listFormat,
      }}
    >
      {children}
    </PoolListContext.Provider>
  );
};
