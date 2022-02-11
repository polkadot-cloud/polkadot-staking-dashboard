import React from 'react';

// context type
export interface ConnectContextState {
  status: number,
  toggle: () => void,
}

// context definition
export const ConnectContext: React.Context<ConnectContextState> = React.createContext({
  status: 0,
  toggle: () => { }
});

// useAssistant
export const useConnect = () => React.useContext(ConnectContext);

// wrapper component to provide components with context
export class ConnectContextWrapper extends React.Component {

  state = {
    status: 0,
  };

  toggle = () => {
    this.setState({ status: this.state.status === 1 ? 0 : 1 })
  }

  render () {
    return (
      <ConnectContext.Provider value={{
        status: this.state.status,
        toggle: this.toggle
      }}>
        {this.props.children}
      </ConnectContext.Provider>
    );
  }
}