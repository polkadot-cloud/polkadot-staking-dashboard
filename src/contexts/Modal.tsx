// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';

export interface ModalContextState {
  status: number;
  setStatus: (status: number) => void;
  openModalWith: (modal: string, config?: any, size?: string) => void;
  setModalHeight: (v: any) => void;
  setResize: () => void;
  modal: string;
  config: any;
  size: string;
  height: any;
  resize: number;
}

// default modal content
const DEFAULT_MODAL_COMPONENT = 'ConnectAccounts';

export const ModalContext: React.Context<ModalContextState> =
  React.createContext({
    status: 0,
    setStatus: (status) => {},
    openModalWith: (modal: string, config?: any, size?: string) => {},
    setModalHeight: (v: any) => {},
    setResize: () => {},
    modal: DEFAULT_MODAL_COMPONENT,
    config: {},
    size: 'large',
    height: 0,
    resize: 0,
  });

export const useModal = () => React.useContext(ModalContext);

// wrapper component to provide components with context
export const ModalProvider = ({ children }: any) => {
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
    setState({
      ...state,
      status: newStatus,
      resize: state.resize + 1,
    });
  };

  const openModalWith = (modal: string, config: any = {}, size = 'large') => {
    setState({
      ...state,
      modal,
      status: 1,
      config,
      size,
      resize: state.resize + 1,
    });
  };

  const setModalHeight = (h: number) => {
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
