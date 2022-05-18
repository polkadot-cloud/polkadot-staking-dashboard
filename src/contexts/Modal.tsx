// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface ModalContextState {
  status: number;
  setStatus: (status: number) => void;
  openModalWith: (modal: string, config?: any, size?: string) => void;
  modal: string;
  config: any;
  size: string;
}

// default modal content
const DEFAULT_MODAL_COMPONENT = 'ConnectAccounts';

export const ModalContext: React.Context<ModalContextState> = React.createContext({
  status: 0,
  setStatus: (status) => { },
  openModalWith: (modal: string, config?: any, size?: string) => { },
  modal: DEFAULT_MODAL_COMPONENT,
  config: {},
  size: 'large',
});

export const useModal = () => React.useContext(ModalContext);

// wrapper component to provide components with context
export class ModalProvider extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      status: 0,
      modal: DEFAULT_MODAL_COMPONENT,
      config: {},
      size: 'large',
    };
  }

  setStatus = (newStatus: number) => {
    this.setState({
      status: newStatus,
    });
  };

  openModalWith = (modal: string, config: any = {}, size = 'large') => {
    this.setState({
      modal,
      status: 1,
      config,
      size,
    });
  };

  render() {
    return (
      <ModalContext.Provider value={{
        status: this.state.status,
        setStatus: this.setStatus,
        openModalWith: this.openModalWith,
        modal: this.state.modal,
        config: this.state.config,
        size: this.state.size,
      }}
      >
        {this.props.children}
      </ModalContext.Provider>
    );
  }
}
