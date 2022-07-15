// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import * as defaults from './defaults';

export const CommunitySectionsContext: React.Context<any> = React.createContext(
  defaults.defaultContext
);

export const useCommunitySections = () =>
  React.useContext(CommunitySectionsContext);

export const CommunitySectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeSection, _setActiveSection] = useState<number>(0);

  const [activeItem, setActiveItem] = useState<any>(defaults.item);

  const setActiveSection = (t: any) => {
    _setActiveSection(t);
  };

  return (
    <CommunitySectionsContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </CommunitySectionsContext.Provider>
  );
};
