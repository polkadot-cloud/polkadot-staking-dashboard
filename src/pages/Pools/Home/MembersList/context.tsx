// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface MembersListContextInterface {
  setListFormat: (v: string) => void;
  listFormat: string;
}

export const MembersListContext =
  React.createContext<MembersListContextInterface>({
    setListFormat: (v: string) => {},
    listFormat: 'col',
  });

export const useMembersList = () => React.useContext(MembersListContext);

export const MembersListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listFormat, _setListFormat] = useState('col');

  const setListFormat = (v: string) => {
    _setListFormat(v);
  };

  return (
    <MembersListContext.Provider
      value={{
        setListFormat,
        listFormat,
      }}
    >
      {children}
    </MembersListContext.Provider>
  );
};
