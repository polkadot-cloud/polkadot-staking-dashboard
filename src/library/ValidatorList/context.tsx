// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export const ValidatorListContext: React.Context<any> = React.createContext({
  setSelectable: (_selectable: boolean) => {},
  addToSelected: (item: any) => {},
  removeFromSelected: (item: any) => {},
  resetSelected: () => {},
  selected: [],
  selectable: false,
});

export const useValidatorList = () => React.useContext(ValidatorListContext);

export const ValidatorListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, setSelected] = useState<Array<any>>([]);
  const [selectActive, _setSelectActive] = useState(false);

  const addToSelected = (_item: any) => {
    setSelected([...selected].concat(_item));
  };

  const removeFromSelected = (_item: any) => {
    setSelected([...selected].filter((item: any) => item !== _item));
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

  return (
    <ValidatorListContext.Provider
      value={{
        setSelectActive,
        addToSelected,
        removeFromSelected,
        resetSelected,
        selected,
        selectActive,
      }}
    >
      {children}
    </ValidatorListContext.Provider>
  );
};
