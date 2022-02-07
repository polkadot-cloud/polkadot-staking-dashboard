import React from 'react';

// context type
export interface AssistantContextState {
  open: number;
  toggle: () => void;
}

// context definition
export const AssistantContext: React.Context<AssistantContextState> = React.createContext({
  open: 0,
  toggle: () => { }
});

// useAssistant
export const useAssistant = () => React.useContext(AssistantContext);

// wrapper component to provide components with context
export class AssistantContextWrapper extends React.Component {

  state = {
    open: 0
  };

  toggle = () => {
    this.setState({ open: this.state.open === 1 ? 0 : 1 })
  }

  render () {
    return (
      <AssistantContext.Provider value={{
        open: this.state.open,
        toggle: this.toggle,
      }}>
        {this.props.children}
      </AssistantContext.Provider>
    );
  }
}
