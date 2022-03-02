// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// context type
export interface AssistantContextState {
  open: number;
  page: string,
  innerDefinition: any,
  toggle: () => void;
  setPage: (page: string) => void;
  setInnerDefinition: (meta: any) => void;
}

// context definition
export const AssistantContext: React.Context<AssistantContextState> = React.createContext({
  open: 0,
  page: 'overview',
  innerDefinition: {},
  toggle: () => { },
  setPage: (p: string) => { },
  setInnerDefinition: (m: any) => { },
});

// useAssistant
export const useAssistant = () => React.useContext(AssistantContext);

// wrapper component to provide components with context
export class AssistantContextWrapper extends React.Component {

  state = {
    open: 0,
    page: 'overview',
    innerDefinition: [],
  };

  setPage = (newPage: string) => {
    this.setState({
      ...this.state,
      page: newPage,
    })
  }

  setInnerDefinition = (meta: any) => {
    this.setState({
      ...this.state,
      innerDefinition: meta,
    });
  }

  toggle = () => {
    this.setState({ open: this.state.open === 1 ? 0 : 1 })
  }

  render () {
    return (
      <AssistantContext.Provider value={{
        open: this.state.open,
        page: this.state.page,
        innerDefinition: this.state.innerDefinition,
        toggle: this.toggle,
        setPage: this.setPage,
        setInnerDefinition: this.setInnerDefinition,
      }}>
        {this.props.children}
      </AssistantContext.Provider>
    );
  }
}
