// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { defaultPromptContext } from './defaults';
import type { PromptContextInterface } from './types';

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<any>({
    size: 'large',
    status: 0,
    Prompt: null,
  });

  const setPrompt = (Prompt: any) => {
    setState({
      ...state,
      Prompt,
    });
  };

  const setStatus = (status: number) => {
    setState({
      ...state,
      status,
      dismissOpen: status !== 0,
    });
  };

  const openPromptWith = (Prompt: any, size = 'small') => {
    setState({
      ...state,
      size,
      Prompt,
      status: 1,
    });
  };

  const closePrompt = () => {
    setState({
      ...state,
      status: 0,
      Prompt: null,
    });
  };

  return (
    <PromptContext.Provider
      value={{
        openPromptWith,
        closePrompt,
        setStatus,
        setPrompt,
        size: state.size,
        status: state.status,
        Prompt: state.Prompt,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const PromptContext =
  React.createContext<PromptContextInterface>(defaultPromptContext);

export const usePrompt = () => React.useContext(PromptContext);
