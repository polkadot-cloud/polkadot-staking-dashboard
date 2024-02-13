// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ReactNode,
  RefObject,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultMenuContext } from './defaults';
import type { MenuContextInterface } from './types';

export const MenuContext =
  createContext<MenuContextInterface>(defaultMenuContext);

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  // Whether the menu is currently open. This initiates menu state but does not reflect whether the
  // menu is being displayed.
  const [open, setOpen] = useState<boolean>(false);

  // Whether the menu is currently showing.
  const [show, setShow] = useState<boolean>(false);

  // The components to be displayed in the menu.
  const [inner, setInner] = useState<ReactNode | null>(null);

  // The menu position coordinates.
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  // Padding from the window edge.
  const DocumentPadding = 20;

  // Sets the menu position and opens it. Only succeeds if the menu has been instantiated and is not
  // currently open.
  const openMenu = (ev: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (open) {
      return;
    }
    const bodyRect = document.body.getBoundingClientRect();
    const x = ev.clientX - bodyRect.left;
    const y = ev.clientY - bodyRect.top;

    setPosition([x, y]);
    setOpen(true);
  };

  // Hides the menu and closes.
  const closeMenu = () => {
    setShow(false);
    setOpen(false);
  };

  // Sets the inner JSX of the menu.
  const setMenuInner = (newInner: ReactNode | null) => {
    setInner(newInner);
  };

  // Adjusts menu position and shows the menu.
  const checkMenuPosition = (ref: RefObject<HTMLDivElement>) => {
    if (!ref?.current) {
      return;
    }

    // Adjust menu position if it is leaking out of the window, otherwise keep it at the current
    // position.
    const bodyRect = document.body.getBoundingClientRect();
    const menuRect = ref.current.getBoundingClientRect();
    const hiddenRight = menuRect.right > bodyRect.right;
    const hiddenBottom = menuRect.bottom > bodyRect.bottom;

    const x = hiddenRight
      ? window.innerWidth - menuRect.width - DocumentPadding
      : position[0];

    const y = hiddenBottom
      ? window.innerHeight - menuRect.height - DocumentPadding
      : position[1];

    setPosition([x, y]);
    setShow(true);
  };

  return (
    <MenuContext.Provider
      value={{
        open,
        show,
        inner,
        position,
        closeMenu,
        openMenu,
        setMenuInner,
        checkMenuPosition,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
