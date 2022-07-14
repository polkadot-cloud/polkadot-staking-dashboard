// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export const CommunitySectionsContext: React.Context<any> = React.createContext(
  {
    setActiveSection: (t: number) => {},
    activeSection: 0,
  }
);

export const useCommunitySections = () =>
  React.useContext(CommunitySectionsContext);

export const CommunitySectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeSection, _setActiveSection] = useState<number>(0);

  const setActiveSection = (t: any) => {
    _setActiveSection(t);
  };

  return (
    <CommunitySectionsContext.Provider
      value={{
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </CommunitySectionsContext.Provider>
  );
};
