// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type {
  Prompt,
  PromptContextInterface,
  PromptSize,
  PromptState,
} from './types'

export const [PromptContext, usePrompt] =
  createSafeContext<PromptContextInterface>()

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PromptState>({
    size: 'lg',
    status: 0,
    Prompt: null,
    onClosePrompt: null,
  })

  // Whether prompt can be closed by clicking outside on container
  const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(false)

  const setPrompt = (Prompt: Prompt) => {
    setState({
      ...state,
      Prompt,
    })
  }

  const setStatus = (status: number) => {
    setState({
      ...state,
      status,
    })
  }

  const openPromptWith = (
    Prompt: Prompt,
    size: PromptSize = 'sm',
    closeOutside = true
  ) => {
    setState({
      ...state,
      size,
      Prompt,
      status: 1,
    })
    setCloseOnOutsideClick(closeOutside)
  }

  const closePrompt = () => {
    if (state.onClosePrompt) {
      state.onClosePrompt()
    }

    setState({
      ...state,
      status: 0,
      Prompt: null,
      onClosePrompt: null,
    })
  }

  const setOnClosePrompt = (onClosePrompt: (() => void) | null) => {
    setState({
      ...state,
      onClosePrompt,
    })
  }

  return (
    <PromptContext.Provider
      value={{
        setOnClosePrompt,
        openPromptWith,
        closePrompt,
        setStatus,
        setPrompt,
        setCloseOnOutsideClick,
        size: state.size,
        status: state.status,
        Prompt: state.Prompt,
        closeOnOutsideClick,
      }}
    >
      {children}
    </PromptContext.Provider>
  )
}
