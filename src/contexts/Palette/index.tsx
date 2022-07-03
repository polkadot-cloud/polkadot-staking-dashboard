// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject, useState } from 'react';
import { defaultPaletteContext } from './defaults';
import { PaletteContextInterface } from './types';

export const PaletteContext = React.createContext<PaletteContextInterface>(
  defaultPaletteContext
);

export const usePalette = () => React.useContext(PaletteContext);

export const PaletteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(0);
  const [show, setShow] = useState(0);

  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const openPalette = () => {
    if (open) return;
    setOpen(1);
  };

  const closePalette = () => {
    setShow(0);
    setTimeout(() => {
      setOpen(0);
    }, 100);
  };

  const setPalettePosition = (posRef: RefObject<HTMLDivElement>) => {
    if (open || !posRef?.current) return;
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = posRef.current.getBoundingClientRect();

    const x = elemRect.left - bodyRect.left;
    const y = elemRect.top - bodyRect.top;

    setPosition([x, y]);
    openPalette();
  };

  const checkPalettePosition = (paletteRef: RefObject<HTMLDivElement>) => {
    if (!paletteRef?.current) return;

    const bodyRect = document.body.getBoundingClientRect();
    const paletteRect = paletteRef.current.getBoundingClientRect();

    let x = paletteRect.left - bodyRect.left;
    let y = paletteRect.top - bodyRect.top;
    const right = paletteRect.right;
    const bottom = paletteRect.bottom;

    const documentPadding = 20;

    if (right > bodyRect.right) {
      x = bodyRect.right - paletteRef.current.offsetWidth - documentPadding;
    }
    if (bottom > bodyRect.bottom) {
      y = bodyRect.bottom - paletteRef.current.offsetHeight - documentPadding;
    }

    setPosition([x, y]);
    setShow(1);
  };

  return (
    <PaletteContext.Provider
      value={{
        openPalette,
        closePalette,
        setPalettePosition,
        checkPalettePosition,
        open,
        show,
        position,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};
