// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject, useState } from 'react';
import { defaultTooltipContext } from './defaults';
import { TooltipContextInterface } from './types';

export const TooltipContext = React.createContext<TooltipContextInterface>(
  defaultTooltipContext
);

export const useTooltip = () => React.useContext(TooltipContext);

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(0);
  const [show, setShow] = useState(0);
  const [text, setText] = useState<string>('');
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const openTooltip = () => {
    if (open) return;
    setOpen(1);
  };

  const closeTooltip = () => {
    setShow(0);
    setTimeout(() => {
      setOpen(0);
    }, 100);
  };

  const setTooltipPosition = (ref: RefObject<HTMLDivElement>) => {
    if (open || !ref?.current) return;
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = ref.current.getBoundingClientRect();

    const x = elemRect.left - bodyRect.left;
    const y = elemRect.top - bodyRect.top;

    setPosition([x, y]);
    openTooltip();
  };

  const checkTooltipPosition = (ref: RefObject<HTMLDivElement>) => {
    if (!ref?.current) return;

    const bodyRect = document.body.getBoundingClientRect();
    const menuRect = ref.current.getBoundingClientRect();

    let x = menuRect.left - bodyRect.left;
    let y = menuRect.top - bodyRect.top - menuRect.height;
    const right = menuRect.right;
    const bottom = menuRect.bottom;

    // small offset from menu start
    y -= 5;

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

  const setTooltipMeta = (t: string) => {
    setText(t);
  };

  return (
    <TooltipContext.Provider
      value={{
        openTooltip,
        closeTooltip,
        setTooltipPosition,
        checkTooltipPosition,
        setTooltipMeta,
        open,
        show,
        position,
        text,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};
