// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { setStateWithRef } from '@polkadotcloud/utils';
import type { RefObject } from 'react';
import React, { useRef, useState } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { defaultModalContext } from './defaults';
import type {
  ModalConfig,
  ModalContextInterface,
  ModalOptions,
  ModalStatus,
} from './types';

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
  const [status, setStatusState] = useState<ModalStatus>('closed');
  const statusRef = useRef(status);

  // Store the modal's resize counter.
  const [resize, setModalResize] = useState<number>(0);

  // Store the ref to the modal height container. Used for controlling whether height is transitionable.
  const [modalRef, setModalRef] = useState<RefObject<HTMLDivElement>>();

  // Store the ref to the modal height container. Used for controlling whether height is transitionable.
  const [heightRef, setHeightRef] = useState<RefObject<HTMLDivElement>>();

  useEffectIgnoreInitial(() => {
    setResize();
  }, [notEnoughFunds]);

  useEffectIgnoreInitial(() => {
    const h = modalRef?.current?.clientHeight || 0;
    if (statusRef.current === 'opening') {
      setModalHeight(h, false);
      if (h > 0) {
        setStatus('open');
      }
    }
  }, [statusRef.current, modalRef?.current]);

  const setOptions = (o: ModalOptions) => {
    setStateWithRef(o, setOptionsState, optionsRef);
  };

  const setStatus = (newStatus: ModalStatus) => {
    setStateWithRef(newStatus, setStatusState, statusRef);
  };

  const openModalWith = (
    modal: string,
    config: ModalConfig = {},
    size = 'large'
  ) => {
    setOptions({
      modal,
      config,
      size,
    });
    setStatus('opening');
  };

  const setModalHeight = (h: number, transition: boolean = true) => {
    if (statusRef.current === 'closed') return;

    // Ensrue transition class is removed if not transitioning. Otherwise, ensure class exists.
    if (transition) transitionOn();
    else transitionOff();

    // If transitioning, ensure the class exists.
    if (transition) transitionOn();

    // Limit maximum height to 80% of window height, and set.
    const maxHeight = window.innerHeight * 0.8;
    h = h > maxHeight ? maxHeight : h;
    setHeight(h);

    // If transitioning, remove after enough time to finish transition.
    if (transition) setTimeout(() => transitionOff(), 500);
  };

  // Increments resize to trigger a height transition.
  const setResize = () => {
    transitionOn();
    setModalResize(resize + 1);
    setTimeout(() => transitionOff(), 500);
  };

  // Closes one modal and opens another.
  const replaceModalWith = (
    modal: string,
    config: ModalConfig = {},
    size = 'large'
  ) => {
    setStatus('replacing');
    setTimeout(() => {
      openModalWith(modal, config, size);
    }, 10);
  };

  // Helper to calculate the maximum height of the modal.
  const modalMaxHeight = () => window.innerHeight * 0.8;

  // helper to set the transition height class of the modal.
  const transitionOn = () =>
    heightRef?.current?.classList.add('transition-height');

  // helper to remove the transition height class of the modal.
  const transitionOff = () =>
    heightRef?.current?.classList.remove('transition-height');

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
        setModalRef,
        setHeightRef,
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
