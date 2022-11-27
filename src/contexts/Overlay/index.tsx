// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { defaultOverlayContext } from './defaults';
import { OverlayContextInterface } from './types';

export const OverlayContext = React.createContext<OverlayContextInterface>(
  defaultOverlayContext
);

export const useOverlay = () => React.useContext(OverlayContext);

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
    const _state = {
      ...state,
      Overlay,
    };
    setState(_state);
  };

  const setStatus = (newStatus: number) => {
    const _state = {
      ...state,
      status: newStatus,
      dismissOpen: newStatus !== 0,
    };
    setState(_state);
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
