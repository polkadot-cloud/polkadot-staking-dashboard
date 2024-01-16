// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultPromptContext } from './defaults';
import type { PromptState, Prompt, PromptContextInterface } from './types';

export const PromptContext =
  createContext<PromptContextInterface>(defaultPromptContext);

export const usePrompt = () => useContext(PromptContext);

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PromptState>({
    size: 'large',
    status: 0,
    Prompt: null,
    onClosePrompt: null,
  });

  const setPrompt = (Prompt: Prompt) => {
    setState({
      ...state,
      Prompt,
    });
  };

  const setStatus = (status: number) => {
    setState({
      ...state,
      status,
    });
  };

  const openPromptWith = (Prompt: Prompt, size = 'small') => {
    setState({
      ...state,
      size,
      Prompt,
      status: 1,
    });
  };

  const closePrompt = () => {
    if (state.onClosePrompt) {
      state.onClosePrompt();
    }

    setState({
      ...state,
      status: 0,
      Prompt: null,
      onClosePrompt: null,
    });
  };

  const setOnClosePrompt = (onClosePrompt: (() => void) | null) => {
    setState({
      ...state,
      onClosePrompt,
    });
  };

  return (
    <PromptContext.Provider
      value={{
        setOnClosePrompt,
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
