// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { MaybeString } from 'types';

export interface PromptContextInterface {
  setOnClosePrompt: (onClosePrompt: (() => void) | null) => void;
  openPromptWith: (o: ReactNode | null, s?: string) => void;
  closePrompt: () => void;
  setStatus: (s: number) => void;
  setPrompt: (d: MaybeString) => void;
  size: string;
  status: number;
  Prompt: Prompt;
}

export interface PromptState {
  size: string;
  status: number;
  Prompt: Prompt;
  onClosePrompt: (() => void) | null;
}

export type Prompt = ReactNode | null;
