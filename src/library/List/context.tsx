// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import * as defaults from './defaults';

export const ListContext: React.Context<any> = React.createContext(
  defaults.defaultContext
);

export const useList = () => React.useContext(ListContext);

export const ListProvider = (props: any) => {
  const selectToggleable = props.selectToggleable ?? true;

  // store the currently selected validators from the list
  const [selected, setSelected] = useState<Array<any>>([]);

  // store whether validator selection is active
  const [selectActive, _setSelectActive] = useState(
    props.selectActive ?? false
  );

  // store the list format of the list
  const [listFormat, _setListFormat] = useState('col');

  const addToSelected = (_item: any) => {
    setSelected([...selected].concat(_item));
  };

  const removeFromSelected = (items: Array<any>) => {
    setSelected([...selected].filter((item) => !items.includes(item)));
  };

  const resetSelected = () => {
    setSelected([]);
  };
  const setSelectActive = (_selectActive: boolean) => {
    _setSelectActive(_selectActive);
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
      {props.children}
    </ListContext.Provider>
  );
};
