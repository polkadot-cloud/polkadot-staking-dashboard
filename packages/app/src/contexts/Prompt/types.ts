// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type { ReactNode } from 'react'

export interface PromptContextInterface {
  setOnClosePrompt: (onClosePrompt: (() => void) | null) => void
  openPromptWith: (
    o: ReactNode | null,
    s?: string,
    closeOnOutsideClick?: boolean
  ) => void
  closePrompt: () => void
  setStatus: (s: number) => void
  setPrompt: (d: MaybeString) => void
  size: string
  status: number
  Prompt: Prompt
  closeOnOutsideClick: boolean
  setCloseOnOutsideClick: (canClose: boolean) => void
}

export interface PromptState {
  size: string
  status: number
  Prompt: Prompt
  onClosePrompt: (() => void) | null
}

export type Prompt = ReactNode | null
