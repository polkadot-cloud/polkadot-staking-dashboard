// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import React, { useState, useEffect } from 'react';
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
  const { network } = useApi();

  // store the active section of the community page
  const [activeSection, _setActiveSection] = useState<number>(0);

  // store the active entity item of the community page
  const [activeItem, setActiveItem] = useState(defaults.item);

  // store the Y scroll position when the last entity was visited
  // used to automatically scroll back down upon returning to the entity lsit.
  const [scrollPos, setScrollPos] = useState<number>(0);

  // go back to first section and reset item when network switches
  useEffect(() => {
    _setActiveSection(0);
    setActiveItem(defaults.item);
  }, [network]);

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
        scrollPos,
        setScrollPos,
      }}
    >
      {children}
    </CommunitySectionsContext.Provider>
  );
};
