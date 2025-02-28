// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault, setStateWithRef } from '@w3ux/utils';
import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { PageWidthMediumThreshold } from 'consts';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { AnyJson } from 'types';
import * as defaults from './defaults';
import type { UIContextInterface } from './types';

export const UIContext = createContext<UIContextInterface>(
  defaults.defaultUIContext
);

export const useUi = () => useContext(UIContext);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  // Side whether the side menu is open.
  const [sideMenuOpen, setSideMenu] = useState<boolean>(false);

  // Store whether in Brave browser. Used for light client warning.
  const [isBraveBrowser, setIsBraveBrowser] = useState<boolean>(false);

  // Store references for main app containers.
  const [containerRefs, setContainerRefsState] = useState<
    Record<string, RefObject<HTMLDivElement>>
  >({});
  const setContainerRefs = (v: Record<string, RefObject<HTMLDivElement>>) => {
    setContainerRefsState(v);
  };

  // Get side menu minimised state from local storage, default to false.
  const [userSideMenuMinimised, setUserSideMenuMinimisedState] =
    useState<boolean>(
      localStorageOrDefault('side_menu_minimised', false, true) as boolean
    );
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised);
  const setUserSideMenuMinimised = (v: boolean) => {
    localStorage.setItem('side_menu_minimised', String(v));
    setStateWithRef(v, setUserSideMenuMinimisedState, userSideMenuMinimisedRef);
  };

  // Automatic side menu minimised.
  const [sideMenuMinimised, setSideMenuMinimised] = useState<boolean>(
    window.innerWidth <= PageWidthMediumThreshold
      ? true
      : userSideMenuMinimisedRef.current
  );

  // Resize side menu callback.
  const resizeCallback = () => {
    if (window.innerWidth <= PageWidthMediumThreshold) {
      setSideMenuMinimised(false);
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current);
    }
  };

  // Resize event listener.
  useEffect(() => {
    (window.navigator as AnyJson)?.brave
      ?.isBrave()
      .then(async (isBrave: boolean) => {
        setIsBraveBrowser(isBrave);
      });

    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  // Re-configure minimised on user change.
  useEffectIgnoreInitial(() => {
    resizeCallback();
  }, [userSideMenuMinimised]);

  return (
    <UIContext.Provider
      value={{
        setSideMenu,
        setUserSideMenuMinimised,
        setContainerRefs,
        sideMenuOpen,
        sideMenuMinimised,
        containerRefs,
        isBraveBrowser,
        userSideMenuMinimised,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
