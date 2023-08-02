// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { setStateWithRef } from '@polkadotcloud/utils';
import React, { useRef, useState } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { defaultModalContext } from './defaults';
import type { ModalConfig, ModalContextInterface, ModalOptions } from './types';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { notEnoughFunds } = useTxMeta();

  // Store the modal configuration options.
  const [options, setOptionsState] = useState<ModalOptions>({
    modal: '',
    config: {},
    size: 'large',
  });
  const optionsRef = useRef(options);

  // Store the modal's current height.
  const [height, setHeight] = useState<number>(0);

  // Store the modal status.
  const [status, setStatusState] = useState<number>(0);
  const statusRef = useRef(status);

  // Store the modal's resize counter.
  const [resize, setModalResize] = useState<number>(0);

  useEffectIgnoreInitial(() => {
    setResize();
  }, [statusRef.current, notEnoughFunds]);

  const setOptions = (o: ModalOptions) => {
    setStateWithRef(o, setOptionsState, optionsRef);
  };

  const setStatus = (newStatus: number) => {
    setHeight(newStatus === 0 ? 0 : height);
    setStateWithRef(newStatus, setStatusState, statusRef);
    setResize();
  };

  const openModalWith = (
    modal: string,
    config: ModalConfig = {},
    size = 'large'
  ) => {
    setStateWithRef(1, setStatusState, statusRef);
    setResize();
    setOptions({
      modal,
      config,
      size,
    });
  };

  const setModalHeight = (h: number) => {
    if (statusRef.current === 0) return;
    // set maximum height to 80% of window height
    const maxHeight = window.innerHeight * 0.8;
    h = h > maxHeight ? maxHeight : h;
    setHeight(h);
  };

  // increments resize to trigger a height transition.
  const setResize = () => {
    setModalResize(resize + 1);
  };

  // closes one modal and opens another.
  const replaceModalWith = (
    modal: string,
    config: ModalConfig = {},
    size = 'large'
  ) => {
    setStatus(3);
    setHeight(0);
    setTimeout(() => {
      openModalWith(modal, config, size);
    }, 10);
  };

  const modalMaxHeight = () => window.innerHeight * 0.8;

  return (
    <ModalContext.Provider
      value={{
        status: statusRef.current,
        setStatus,
        openModalWith,
        replaceModalWith,
        setModalHeight,
        setResize,
        height,
        resize,
        modalMaxHeight,
        modal: optionsRef.current.modal,
        config: optionsRef.current.config,
        size: optionsRef.current.size,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const ModalContext =
  React.createContext<ModalContextInterface>(defaultModalContext);

export const useModal = () => React.useContext(ModalContext);
