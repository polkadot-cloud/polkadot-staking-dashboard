// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export const ValidatorListContext: React.Context<any> = React.createContext({
  setSelected: (_selected: Array<any>) => {},
  setSelectable: (_selectable: boolean) => {},
  selected: [],
  selectable: false,
});

export const useValidatorList = () => React.useContext(ValidatorListContext);

export const ValidatorListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, _setSelected] = useState<Array<any>>([]);
  const [selectable, _setSelectable] = useState(false);

  const setSelected = (_selected: Array<any>) => {
    _setSelected(_selected);
  };

  const setSelectable = (_selectable: boolean) => {
    _setSelectable(_selectable);
  };

  return (
    <ValidatorListContext.Provider
      value={{
        setSelected,
        setSelectable,
        selected,
        selectable,
      }}
    >
      {children}
    </ValidatorListContext.Provider>
  );
};
