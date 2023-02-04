// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTxFees } from 'contexts/TxFees';
import React, { useEffect, useState } from 'react';
import { defaultModalContext } from './defaults';
import { ModalConfig, ModalContextInterface, ModalOptions } from './types';

export const ModalContext =
  React.createContext<ModalContextInterface>(defaultModalContext);

export const useModal = () => React.useContext(ModalContext);

// wrapper component to provide components with context
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { notEnoughFunds } = useTxFees();

  // Store the modal configuration options.
  const [options, setOptions] = useState<ModalOptions>({
    modal: '',
    config: {},
    size: 'large',
  });

  // Store the modal's current height.
  const [height, setHeight] = useState<number>(0);

  // Store the modal status.
  const [status, setModalStatus] = useState<number>(0);

  // Store the modal's resize counter.
  const [resize, setModalResize] = useState<number>(0);

  useEffect(() => {
    setResize();
  }, [status, notEnoughFunds]);

  const setStatus = (newStatus: number) => {
    setHeight(newStatus === 0 ? 0 : height);
    setModalStatus(newStatus);
    setResize();
  };

  const openModalWith = (
    modal: string,
    config: ModalConfig = {},
    size = 'large'
  ) => {
    setStatus(1);
    setResize();
    setOptions({
      modal,
      config,
      size,
    });
  };

  const setModalHeight = (h: number) => {
    if (status === 0) return;
    // set maximum height to 80% of window height
    const maxHeight = window.innerHeight * 0.8;
    h = h > maxHeight ? maxHeight : h;
    setHeight(h);
  };

  // increments resize to trigger a height transition.
  const setResize = () => {
    setModalResize(resize + 1);
  };

  return (
    <ModalContext.Provider
      value={{
        status,
        setStatus,
        openModalWith,
        setModalHeight,
        setResize,
        height,
        resize,
        modal: options.modal,
        config: options.config,
        size: options.size,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
