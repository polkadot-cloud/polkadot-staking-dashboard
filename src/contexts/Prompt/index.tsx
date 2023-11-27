// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { defaultPromptContext } from './defaults';
import type {
  PromptContextInfo,
  PromptContextInterface,
  PromptType,
} from './types';

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<PromptContextInfo>({
    size: 'large',
    status: 0,
    Prompt: null,
  });

  const setPrompt = (Prompt: PromptType) => {
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

  const openPromptWith = (Prompt: PromptType, size = 'small') => {
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
