// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// context type
export interface ModalContextState {
  status: number;
  setStatus: (status: number) => void;
  modal: string;
}

// default modal content
const DEFAULT_MODAL_COMPONENT = 'ConnectAccounts';

// context definition
export const AssistantContext: React.Context<ModalContextState> = React.createContext({
  status: 0,
  setStatus: (status) => { },
  modal: DEFAULT_MODAL_COMPONENT,
});

export const useModal = () => React.useContext(AssistantContext);

// wrapper component to provide components with context
export class ModalContextWrapper extends React.Component {

  state = {
    status: 0,
    modal: DEFAULT_MODAL_COMPONENT,
  };

  setStatus = (newStatus: number) => {
    this.setState({
      status: newStatus
    })
  }

  render () {
    return (
      <AssistantContext.Provider value={{
        status: this.state.status,
        setStatus: this.setStatus,
        modal: this.state.modal,
      }}>
        {this.props.children}
      </AssistantContext.Provider>
    );
  }
}