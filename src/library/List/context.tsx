// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import * as defaults from './defaults';

export const ListContext: React.Context<any> = React.createContext(
  defaults.defaultContext
);

export const useList = () => React.useContext(ListContext);

export const ListProvider = ({
  selectToggleable = true,
  selectActive: initialSelctActive = false,
  children,
}: any) => {
  // store the currently selected validators from the list
  const [selected, setSelected] = useState<any[]>([]);

  // store whether validator selection is active
  const [selectActive, setSelectActiveState] = useState(
    initialSelctActive ?? false
  );

  // store the list format of the list
  const [listFormat, _setListFormat] = useState('col');

  const addToSelected = (_item: any) => {
    setSelected([...selected].concat(_item));
  };

  const removeFromSelected = (items: any[]) => {
    setSelected([...selected].filter((item) => !items.includes(item)));
  };

  const resetSelected = () => {
    setSelected([]);
  };

  const setSelectActive = (_selectActive: boolean) => {
    setSelectActiveState(_selectActive);
    if (_selectActive === false) {
      resetSelected();
    }
  };

  const setListFormat = (v: string) => {
    _setListFormat(v);
  };

  return (
    <ListContext.Provider
      value={{
        setSelectActive,
        addToSelected,
        removeFromSelected,
        resetSelected,
        setListFormat,
        selected,
        selectActive,
        listFormat,
        selectToggleable,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
