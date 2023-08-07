// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import * as defaults from './defaults';
import type {
  CanvasContextInterface,
  CanvasContextProps,
  CanvasContextState,
} from './types';

export const CanvasProvider = ({ children }: CanvasContextProps) => {
  const [state, setState] = useState<CanvasContextState>({
    status: 0,
  });

  // when fade out completes, reset active definiton.
  useEffectIgnoreInitial(() => {
    if (state.status === 0) {
      setState({
        ...state,
      });
    }
  }, [state.status]);

  const setStatus = (newStatus: number) => {
    setState({
      ...state,
      status: newStatus,
    });
  };

  const openCanvas = () => {
    setState({
      ...state,
      status: 1,
    });
  };

  const closeCanvas = () => {
    setState({
      ...state,
      status: 2,
    });
  };

  return (
    <CanvasContext.Provider
      value={{
        openCanvas,
        closeCanvas,
        setStatus,
        status: state.status,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const CanvasContext = React.createContext<CanvasContextInterface>(
  defaults.defaultCanvasContext
);

export const useCanvas = () => React.useContext(CanvasContext);
