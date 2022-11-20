// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { MaybeString } from 'types';
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
    status: 0,
    overlay: null,
    config: {},
  });

  const setOverlay = (overlay: MaybeString) => {
    const _state = {
      ...state,
      overlay,
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

  const openOverlayWith = (overlay: MaybeString, _config: any = {}) => {
    setState({
      ...state,
      overlay,
      status: 1,
      config: _config,
    });
  };

  const closeOverlay = () => {
    setState({
      ...state,
      status: 0,
      overlay: null,
    });
  };

  return (
    <OverlayContext.Provider
      value={{
        openOverlayWith,
        closeOverlay,
        setStatus,
        setOverlay,
        status: state.status,
        overlay: state.overlay,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};
