// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export const ValidatorListContext: React.Context<any> = React.createContext({
  setSelectable: (_selectable: boolean) => {},
  addToSelected: (item: any) => {},
  removeFromSelected: (items: Array<any>) => {},
  resetSelected: () => {},
  setListFormat: (v: string) => {},
  selected: [],
  selectable: false,
  listFormat: 'col',
});

export const useValidatorList = () => React.useContext(ValidatorListContext);

export const ValidatorListProvider = (props: any) => {
  const [selected, setSelected] = useState<Array<any>>([]);
  const [selectActive, _setSelectActive] = useState(
    props.selectActive ?? false
  );
  const [listFormat, _setListFormat] = useState('col');

  const addToSelected = (_item: any) => {
    setSelected([...selected].concat(_item));
  };

  const removeFromSelected = (items: Array<any>) => {
    setSelected([...selected].filter((item: any) => !items.includes(item)));
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
    <ValidatorListContext.Provider
      value={{
        setSelectActive,
        addToSelected,
        removeFromSelected,
        resetSelected,
        setListFormat,
        selected,
        selectActive,
        listFormat,
      }}
    >
      {props.children}
    </ValidatorListContext.Provider>
  );
};
