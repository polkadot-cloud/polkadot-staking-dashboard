// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { defaultModalContext } from './defaults';
import { ModalContextInterface } from './types';

// default modal content
const DEFAULT_MODAL_COMPONENT = 'ConnectAccounts';

export const ModalContext =
  React.createContext<ModalContextInterface>(defaultModalContext);

export const useModal = () => React.useContext(ModalContext);

// wrapper component to provide components with context
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState]: any = useState({
    status: 0,
    modal: DEFAULT_MODAL_COMPONENT,
    config: {},
    size: 'large',
    height: 0,
    resize: 0,
  });

  useEffect(() => {
    setResize();
  }, [state.status]);

  const setStatus = (newStatus: number) => {
    const _state = {
      ...state,
      status: newStatus,
      resize: state.resize + 1,
      height: newStatus === 0 ? 0 : state.height,
    };
    setState(_state);
  };

  const openModalWith = (modal: string, _config: any = {}, size = 'large') => {
    setState({
      ...state,
      modal,
      status: 1,
      config: _config,
      size,
      resize: state.resize + 1,
    });
  };

  const setModalHeight = (h: number) => {
    if (state.status === 0) return;
    // set maximum height to 80% of window height
    const maxHeight = window.innerHeight * 0.8;
    h = h > maxHeight ? maxHeight : h;
    setState({
      ...state,
      height: h,
    });
  };

  const setResize = () => {
    // increments resize to trigger a height transition
    setState({
      ...state,
      resize: state.resize + 1,
    });
  };

  return (
    <ModalContext.Provider
      value={{
        status: state.status,
        setStatus,
        openModalWith,
        setModalHeight,
        setResize,
        modal: state.modal,
        config: state.config,
        size: state.size,
        height: state.height,
        resize: state.resize,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
