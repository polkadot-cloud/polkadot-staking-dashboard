import React from 'react';

// context type
export interface ConnectContextState {
  status: number,
  connect: () => void,
  disconnect: () => void;
}

// context definition
export const ConnectContext: React.Context<ConnectContextState> = React.createContext({
  status: 0,
  connect: () => { },
  disconnect: () => { }
});

// useAssistant
export const useConnect = () => React.useContext(ConnectContext);

// wrapper component to provide components with context
export class ConnectContextWrapper extends React.Component {

  state = {
    status: 0,
  };

  connect = () => {
    this.setState({ status: 1 })
  }

  disconnect = () => {
    this.setState({ status: 0 })
  }

  render () {
    return (
      <ConnectContext.Provider value={{
        status: this.state.status,
        connect: this.connect,
        disconnect: this.disconnect
      }}>
        {this.props.children}
      </ConnectContext.Provider>
    );
  }
}