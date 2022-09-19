// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { HelpContextProps } from './types';

export const HelpContext = React.createContext<any>(null);

export const useHelp = () => React.useContext(HelpContext);

export const HelpProvider = (props: HelpContextProps) => {
  // to abstract out into individual state items
  const [state, setState] = useState<any>({
    status: 0,
    definition: null,
    config: {},
    height: 0,
    resize: 0,
  });

  // new functions

  const setHelpHeight = (h: number) => {
    if (state.status === 0) return;
    // set maximum height to 80% of window height
    const maxHeight = window.innerHeight * 0.8;
    h = h > maxHeight ? maxHeight : h;
    setState({
      ...state,
      height: h,
    });
  };

  const setStatus = (newStatus: number) => {
    const _state = {
      ...state,
      status: newStatus,
      resize: state.resize + 1,
      height: newStatus === 0 ? 0 : state.height,
    };
    setState(_state);
  };

  const openHelpWith = (definition: string, _config: any = {}) => {
    setState({
      ...state,
      definition,
      status: 1,
      config: _config,
      resize: state.resize + 1,
    });
  };

  return (
    <HelpContext.Provider
      value={{
        setHelpHeight,
        openHelpWith,
        setStatus,
        status: state.status,
        size: state.size,
        height: state.height,
        resize: state.resize,
      }}
    >
      {props.children}
    </HelpContext.Provider>
  );
};
