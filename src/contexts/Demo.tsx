import React from 'react';
import window from 'window-or-global';

// context type
export interface DemoContextState {
  mode: number;
  switch: (newMode: number) => void;
}

// context definition
export const DemoContext: React.Context<DemoContextState> = React.createContext({
  mode: 0,
  switch: (newMode: number) => { }
});

// import context as a hook
export const useDemo = () => React.useContext(DemoContext);

// wrapper component to provide components with context
export class DemoContextWrapper extends React.Component {

  componentDidMount () {

    // listen for D key to toggle demo bar
    window.onkeydown = (e: KeyboardEvent): any => {
      if (e.code === 'KeyD') {
        this.setState({
          mode: this.state.mode === 0 ? 1 : 0
        });
      }
    }
  }

  state = {
    mode: 0,
  };

  switch = (newMode: number) => {
    this.setState({ mode: newMode })
  }

  render () {
    return (
      <DemoContext.Provider value={{
        mode: this.state.mode,
        switch: this.switch,
      }}>
        {this.props.children}
      </DemoContext.Provider>
    );
  }
}
