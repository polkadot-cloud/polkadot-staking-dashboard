// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect, useState } from 'react';
import { useNetwork } from 'contexts/Network';
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
  const { network } = useNetwork();

  // store the active section of the community page
  const [activeSection, setActiveSectionState] = useState<number>(0);

  // store the active entity item of the community page
  const [activeItem, setActiveItem] = useState(defaults.item);

  // store the Y scroll position when the last entity was visited
  // used to automatically scroll back down upon returning to the entity lsit.
  const [scrollPos, setScrollPos] = useState<number>(0);

  // go back to first section and reset item when network switches
  useEffect(() => {
    setActiveSectionState(0);
    setActiveItem(defaults.item);
  }, [network]);

  const setActiveSection = (t: any) => {
    setActiveSectionState(t);
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
