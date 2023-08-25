// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type React from 'react';
import type { MaybeString } from 'types';

export interface PromptContextInterface {
  openPromptWith: (o: React.ReactNode | null, s?: string) => void;
  closePrompt: () => void;
  setStatus: (s: number) => void;
  setPrompt: (d: MaybeString) => void;
  size: string;
  status: number;
  Prompt: React.ReactNode | null;
}
