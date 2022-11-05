// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { MaybeString } from 'types';
import { defaultTipsContext } from './defaults';
import { TipsContextInterface } from './types';

export const TipsContext =
  React.createContext<TipsContextInterface>(defaultTipsContext);

export const useTips = () => React.useContext(TipsContext);

export const TipsProvider = ({ children }: { children: React.ReactNode }) => {
  // module state
  const [state, setState] = useState<any>({
    status: 0,
    tip: null,
    dismissOpen: false,
    config: {},
  });

  // when fade out completes, reset active definiton
  useEffect(() => {
    if (state.status === 0) {
      setState({
        ...state,
        tip: null,
      });
    }
  }, [state, state.status]);

  const setTip = (tip: MaybeString) => {
    const _state = {
      ...state,
      tip,
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

  const openTipWith = (tip: MaybeString, _config: any = {}) => {
    setState({
      ...state,
      tip,
      status: 1,
      config: _config,
    });
  };

  const closeTip = () => {
    setState({
      ...state,
      status: 2,
    });
  };

  const toggleDismiss = (open: boolean) => {
    setState({
      ...state,
      status: 1,
      dismissOpen: open,
    });
  };

  return (
    <TipsContext.Provider
      value={{
        openTipWith,
        closeTip,
        setStatus,
        setTip,
        toggleDismiss,
        dismissOpen: state.dismissOpen,
        status: state.status,
        tip: state.tip,
      }}
    >
      {children}
    </TipsContext.Provider>
  );
};
