// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject, useState } from 'react';

import { defaultMenuContext } from './defaults';
import { MenuContextInterface } from './types';

export const MenuContext =
  React.createContext<MenuContextInterface>(defaultMenuContext);

export const useMenu = () => React.useContext(MenuContext);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(0);
  const [show, setShow] = useState(0);
  const [items, setItems] = useState<React.ReactNode[]>([]);

  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const openMenu = () => {
    if (open) return;
    setOpen(1);
  };

  const closeMenu = () => {
    setShow(0);
    setTimeout(() => {
      setOpen(0);
    }, 100);
  };

  const setMenuPosition = (ref: RefObject<HTMLDivElement>) => {
    if (open || !ref?.current) return;
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = ref.current.getBoundingClientRect();

    const x = elemRect.left - bodyRect.left;
    const y = elemRect.top - bodyRect.top;

    setPosition([x, y]);
    openMenu();
  };

  const checkMenuPosition = (ref: RefObject<HTMLDivElement>) => {
    if (!ref?.current) return;

    const bodyRect = document.body.getBoundingClientRect();
    const menuRect = ref.current.getBoundingClientRect();

    let x = menuRect.left - bodyRect.left;
    let y = menuRect.top - bodyRect.top;
    const right = menuRect.right;
    const bottom = menuRect.bottom;

    // small offset from menu start
    y -= 10;

    const documentPadding = 20;

    if (right > bodyRect.right) {
      x = bodyRect.right - ref.current.offsetWidth - documentPadding;
    }
    if (bottom > bodyRect.bottom) {
      y = bodyRect.bottom - ref.current.offsetHeight - documentPadding;
    }
    setPosition([x, y]);
    setShow(1);
  };

  const setMenuItems = (_items: React.ReactNode[]) => {
    setItems(_items);
  };

  return (
    <MenuContext.Provider
      value={{
        openMenu,
        closeMenu,
        setMenuPosition,
        checkMenuPosition,
        setMenuItems,
        open,
        show,
        position,
        items,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
