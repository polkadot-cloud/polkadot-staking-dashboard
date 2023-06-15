// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { defaultOverlayContext } from './defaults';
import type { OverlayContextInterface } from './types';

export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<any>({
    size: 'large',
    status: 0,
    Overlay: null,
  });

  const setOverlay = (Overlay: any) => {
    setState({
      ...state,
      Overlay,
    });
  };

  const setStatus = (status: number) => {
    setState({
      ...state,
      status,
      dismissOpen: status !== 0,
    });
  };

  const openOverlayWith = (Overlay: any, size = 'small') => {
    setState({
      ...state,
      size,
      Overlay,
      status: 1,
    });
  };

  const closeOverlay = () => {
    setState({
      ...state,
      status: 0,
      Overlay: null,
    });
  };

  return (
    <OverlayContext.Provider
      value={{
        openOverlayWith,
        closeOverlay,
        setStatus,
        setOverlay,
        size: state.size,
        status: state.status,
        Overlay: state.Overlay,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const OverlayContext = React.createContext<OverlayContextInterface>(
  defaultOverlayContext
);

export const useOverlay = () => React.useContext(OverlayContext);
